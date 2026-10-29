<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    fwrite(STDERR, "Chưa có backend/config.php. Hãy cấu hình MySQL trước.\n");
    exit(1);
}

$config = require $configPath;
if (!is_array($config) || empty($config['username'])) {
    fwrite(STDERR, "Cấu hình MySQL không hợp lệ.\n");
    exit(1);
}

function promptPassword(string $prompt): string
{
    fwrite(STDOUT, $prompt);
    if (PHP_OS_FAMILY === 'Windows') {
        $command = 'powershell.exe -NoProfile -Command "$secure = Read-Host -AsSecureString; '
            . '$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure); '
            . 'try { [Console]::Write([Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)) } '
            . 'finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }"';
        $password = shell_exec($command);
        fwrite(STDOUT, PHP_EOL);
        return is_string($password) ? $password : '';
    }

    fwrite(STDOUT, "(Ký tự nhập sẽ hiển thị trên terminal.)\n");
    $password = fgets(STDIN);
    return $password === false ? '' : rtrim($password, "\r\n");
}

$username = trim((string) readline('Tên đăng nhập admin (3–64 ký tự, chữ/số/._-): '));
if (!preg_match('/^[A-Za-z0-9._-]{3,64}$/', $username)) {
    fwrite(STDERR, "Tên đăng nhập không hợp lệ.\n");
    exit(1);
}

$password = promptPassword("Nhập mật khẩu admin (ít nhất 12 ký tự): ");
$confirmation = promptPassword('Nhập lại mật khẩu: ');
if (strlen($password) < 12 || strlen($password) > 4096 || !hash_equals($password, $confirmation)) {
    fwrite(STDERR, "Mật khẩu chưa đủ 12 ký tự hoặc hai lần nhập không khớp.\n");
    exit(1);
}

try {
    $host = $config['host'] ?? '127.0.0.1';
    $port = (int) ($config['port'] ?? 3306);
    $database = $config['database'] ?? 'tan_an_hoi';
    $pdo = new PDO(
        "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4",
        $config['username'],
        $config['password'] ?? '',
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    $lock = $pdo->query("SELECT GET_LOCK('tan_an_hoi_create_first_admin', 10)")->fetchColumn();
    if ((int) $lock !== 1) {
        throw new RuntimeException('Không lấy được khóa khởi tạo tài khoản admin.');
    }

    $adminCount = (int) $pdo->query("SELECT COUNT(*) FROM tai_khoan WHERE role = 'admin'")->fetchColumn();
    if ($adminCount > 0) {
        throw new RuntimeException('Đã có tài khoản admin. Không thể chạy khởi tạo lần đầu lần nữa.');
    }

    $insert = $pdo->prepare(
        "INSERT INTO tai_khoan (username, password_hash, role, hamlet_id)
         VALUES (?, ?, 'admin', NULL)"
    );
    $insert->execute([$username, password_hash($password, PASSWORD_DEFAULT)]);
    $pdo->query("SELECT RELEASE_LOCK('tan_an_hoi_create_first_admin')");
    fwrite(STDOUT, "Đã tạo tài khoản quản trị viên. Đăng nhập bằng tên tài khoản vừa tạo.\n");
} catch (Throwable $error) {
    if (isset($pdo) && $pdo instanceof PDO) {
        $pdo->query("SELECT RELEASE_LOCK('tan_an_hoi_create_first_admin')");
    }
    fwrite(STDERR, "Không thể tạo admin: {$error->getMessage()}\n");
    exit(1);
}
