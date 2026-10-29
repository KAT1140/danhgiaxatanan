<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$isHttps = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== '' && $_SERVER['HTTPS'] !== 'off';
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $isHttps,
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

function respond(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function readJsonBody(): array
{
    $rawBody = file_get_contents('php://input');
    $body = json_decode($rawBody === false ? '' : $rawBody, true);
    if (!is_array($body)) {
        respond(400, ['error' => 'Nội dung gửi lên không phải JSON hợp lệ.']);
    }
    return $body;
}

function requireAuthentication(): array
{
    $user = $_SESSION['user'] ?? null;
    if (!is_array($user)) {
        respond(401, ['error' => 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.']);
    }
    return $user;
}

function requireCsrfToken(): void
{
    $expected = $_SESSION['csrf_token'] ?? '';
    $provided = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!is_string($expected) || $expected === '' || !is_string($provided) || !hash_equals($expected, $provided)) {
        respond(403, ['error' => 'Mã bảo vệ phiên không hợp lệ. Hãy tải lại trang và thử lại.']);
    }
}

function getDatabase(): PDO
{
    $configPath = __DIR__ . '/config.php';
    if (!is_file($configPath)) {
        respond(500, [
            'error' => 'Chưa có backend/config.php. Hãy sao chép config.example.php thành config.php và cấu hình MySQL.',
        ]);
    }

    $config = require $configPath;
    if (!is_array($config)) {
        throw new RuntimeException('Cấu hình cơ sở dữ liệu không hợp lệ.');
    }

    $host = $config['host'] ?? '127.0.0.1';
    $port = (int) ($config['port'] ?? 3306);
    $database = $config['database'] ?? 'tan_an_hoi';
    $username = $config['username'] ?? '';
    $password = $config['password'] ?? '';
    if ($username === '') {
        respond(500, ['error' => 'Chưa cấu hình tài khoản MySQL trong backend/config.php.']);
    }

    return new PDO(
        "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
}

function saveAssessmentHistory(
    PDO $pdo,
    int $hamletId,
    int $submittedBy,
    array $assessments,
    ?int $confirmedBy = null
): int {
    $totalScore = array_sum(array_map(
        static fn (array $assessment): int => (int) $assessment['score'],
        $assessments
    ));
    $historyQuery = $pdo->prepare(
        'INSERT INTO lich_su_danh_gia
            (hamlet_id, submitted_by, confirmed_by, confirmed_at, total_score)
         VALUES (?, ?, ?, IF(? IS NULL, NULL, CURRENT_TIMESTAMP), ?)'
    );
    $historyQuery->execute([$hamletId, $submittedBy, $confirmedBy, $confirmedBy, $totalScore]);
    $historyId = (int) $pdo->lastInsertId();

    $historyItemQuery = $pdo->prepare(
        'INSERT INTO chi_tiet_lich_su_danh_gia
            (history_id, criterion_id, criterion_title, max_points, score, self_evidence, evidence_links)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    foreach ($assessments as $assessment) {
        $historyItemQuery->execute([
            $historyId,
            $assessment['criterion_id'],
            $assessment['criterion_title'],
            $assessment['max_points'],
            $assessment['score'],
            $assessment['self_evidence'],
            $assessment['evidence_links'],
        ]);
    }

    return $historyId;
}

function saveCommuneHistoryScores(PDO $pdo, int $historyId, array $scores): bool
{
    $historyItemsQuery = $pdo->prepare(
        'SELECT criterion_id, max_points, score
         FROM chi_tiet_lich_su_danh_gia
         WHERE history_id = ?
         FOR UPDATE'
    );
    $historyItemsQuery->execute([$historyId]);
    $historyItems = $historyItemsQuery->fetchAll();
    $historyCriterionIds = array_map(
        static fn (array $item): int => (int) $item['criterion_id'],
        $historyItems
    );
    sort($historyCriterionIds);
    if ($historyCriterionIds === [] || count(array_diff(array_keys($scores), $historyCriterionIds)) > 0) {
        return false;
    }
    foreach ($historyItems as $item) {
        $criterionId = (int) $item['criterion_id'];
        $score = $scores[$criterionId] ?? (int) $item['score'];
        if ($score < 0 || $score > (int) $item['max_points']) {
            return false;
        }
    }

    $updateScore = $pdo->prepare(
        'UPDATE chi_tiet_lich_su_danh_gia
         SET commune_score = ?
         WHERE history_id = ? AND criterion_id = ?'
    );
    foreach ($historyItems as $item) {
        $criterionId = (int) $item['criterion_id'];
        $score = $scores[$criterionId] ?? (int) $item['score'];
        $updateScore->execute([$score, $historyId, $criterionId]);
    }
    return true;
}

try {
    $pdo = getDatabase();
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'POST') {
        $body = readJsonBody();
        $action = $body['action'] ?? '';

        if ($action === 'login') {
            $username = $body['username'] ?? null;
            $password = $body['password'] ?? null;
            if (!is_string($username) || !is_string($password) || $username === '' || $password === '') {
                respond(400, ['error' => 'Vui lòng nhập tên đăng nhập và mật khẩu.']);
            }

            $login = $pdo->prepare(
                'SELECT users.id, users.username, users.password_hash, users.role, users.hamlet_id,
                        hamlets.name AS hamlet_name
                 FROM tai_khoan AS users
                 LEFT JOIN ap AS hamlets ON hamlets.id = users.hamlet_id
                 WHERE users.username = ?
                 LIMIT 1'
            );
            $login->execute([$username]);
            $user = $login->fetch();
            if (!$user || !password_verify($password, $user['password_hash'])) {
                respond(401, ['error' => 'Tên đăng nhập hoặc mật khẩu không chính xác.']);
            }
            if ($user['role'] === 'hamlet' && $user['hamlet_id'] === null) {
                respond(403, ['error' => 'Tài khoản này chưa được gán cho một ấp. Hãy liên hệ quản trị viên.']);
            }

            session_regenerate_id(true);
            $_SESSION['user'] = [
                'id' => (int) $user['id'],
                'username' => $user['username'],
                'role' => $user['role'],
                'hamlet_id' => $user['hamlet_id'] === null ? null : (int) $user['hamlet_id'],
                'hamlet_name' => $user['hamlet_name'],
            ];
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
            respond(200, [
                'user' => $_SESSION['user'],
                'csrf_token' => $_SESSION['csrf_token'],
            ]);
        }

        $user = requireAuthentication();
        requireCsrfToken();

        if ($action === 'logout') {
            $_SESSION = [];
            session_destroy();
            respond(200, ['message' => 'Đã đăng xuất.']);
        }

        if ($action === 'delete_assessment_history') {
            if ($user['role'] !== 'hamlet' || !is_int($user['hamlet_id'] ?? null)) {
                respond(403, ['error' => 'Chỉ tài khoản thường được xóa lịch sử của ấp đã phân quyền.']);
            }

            $historyId = filter_var($body['history_id'] ?? null, FILTER_VALIDATE_INT);
            if ($historyId === false || $historyId === null || $historyId < 1) {
                respond(400, ['error' => 'Mã lần đánh giá cần xóa không hợp lệ.']);
            }

            $deleteHistory = $pdo->prepare(
                'DELETE FROM lich_su_danh_gia WHERE id = ? AND hamlet_id = ?'
            );
            $deleteHistory->execute([$historyId, $user['hamlet_id']]);
            if ($deleteHistory->rowCount() !== 1) {
                respond(404, ['error' => 'Không tìm thấy lần đánh giá cần xóa trong ấp được phân quyền.']);
            }

            respond(200, ['message' => 'Đã xóa lần đánh giá khỏi lịch sử.']);
        }

        if ($action === 'create_user') {
            if ($user['role'] !== 'admin') {
                respond(403, ['error' => 'Chỉ quản trị viên được tạo tài khoản.']);
            }

            $username = $body['username'] ?? null;
            $password = $body['password'] ?? null;
            $hamletId = filter_var($body['hamlet_id'] ?? null, FILTER_VALIDATE_INT);
            if (!is_string($username) || !preg_match('/^[A-Za-z0-9._-]{3,64}$/', $username)) {
                respond(400, ['error' => 'Tên đăng nhập cần dài 3–64 ký tự, chỉ gồm chữ không dấu, số, dấu chấm, gạch ngang hoặc gạch dưới.']);
            }
            if (!is_string($password) || !preg_match('/^[0-9]{6,4096}$/D', $password)) {
                respond(400, ['error' => 'Mật khẩu cần có ít nhất 6 chữ số và chỉ gồm số.']);
            }
            if ($hamletId === false || $hamletId === null) {
                respond(400, ['error' => 'Vui lòng chọn ấp cho tài khoản.']);
            }

            $hamletQuery = $pdo->prepare('SELECT id, name FROM ap WHERE id = ?');
            $hamletQuery->execute([$hamletId]);
            $hamlet = $hamletQuery->fetch();
            if (!$hamlet) {
                respond(400, ['error' => 'Ấp được chọn không hợp lệ.']);
            }

            try {
                $create = $pdo->prepare(
                    'INSERT INTO tai_khoan (username, password_hash, role, hamlet_id)
                     VALUES (?, ?, \'hamlet\', ?)'
                );
                $create->execute([$username, password_hash($password, PASSWORD_DEFAULT), $hamletId]);
            } catch (PDOException $error) {
                if ($error->getCode() === '23000') {
                    respond(409, ['error' => 'Tên đăng nhập này đã được sử dụng.']);
                }
                throw $error;
            }

            respond(201, [
                'user' => [
                    'id' => (int) $pdo->lastInsertId(),
                    'username' => $username,
                    'role' => 'hamlet',
                    'hamlet_id' => (int) $hamlet['id'],
                    'hamlet_name' => $hamlet['name'],
                ],
            ]);
        }

        if ($action === 'set_score_approval') {
            if ($user['role'] !== 'admin') {
                respond(403, ['error' => 'Chỉ quản trị viên được xác nhận điểm.']);
            }

            $hamletId = filter_var($body['hamlet_id'] ?? null, FILTER_VALIDATE_INT);
            $approved = $body['approved'] ?? null;
            if ($hamletId === false || $hamletId === null || !is_bool($approved)) {
                respond(400, ['error' => 'Cần có mã ấp và trạng thái xác nhận hợp lệ.']);
            }
            $requestedHistoryId = isset($body['history_id'])
                ? filter_var($body['history_id'], FILTER_VALIDATE_INT)
                : null;
            if ($requestedHistoryId === false || ($requestedHistoryId !== null && $requestedHistoryId < 1)) {
                respond(400, ['error' => 'Mã lần đánh giá cần xác nhận không hợp lệ.']);
            }

            $communeScores = [];
            if ($approved) {
                $criteriaRows = $pdo->query(
                    'SELECT id, max_points FROM tieu_chi_danh_gia ORDER BY id'
                )->fetchAll();
                $maxPointsById = [];
                foreach ($criteriaRows as $criterion) {
                    $maxPointsById[(int) $criterion['id']] = (int) $criterion['max_points'];
                }
                $submittedScores = $body['commune_scores'] ?? [];
                if (!is_array($submittedScores) || count($submittedScores) > count($maxPointsById)) {
                    respond(400, ['error' => 'Danh sách điểm xã không hợp lệ.']);
                }
                foreach ($submittedScores as $entry) {
                    if (!is_array($entry)) {
                        respond(400, ['error' => 'Một điểm xã đánh giá không hợp lệ.']);
                    }
                    $criterionId = filter_var($entry['criterion_id'] ?? null, FILTER_VALIDATE_INT);
                    $score = filter_var($entry['score'] ?? null, FILTER_VALIDATE_INT);
                    if (
                        $criterionId === false ||
                        $criterionId === null ||
                        !array_key_exists($criterionId, $maxPointsById) ||
                        array_key_exists($criterionId, $communeScores) ||
                        $score === false ||
                        $score === null ||
                        $score < 0 ||
                        $score > $maxPointsById[$criterionId]
                    ) {
                        respond(400, ['error' => 'Điểm xã phải là số nguyên hợp lệ trong giới hạn điểm của tiêu chí.']);
                    }
                    $communeScores[$criterionId] = $score;
                }
            }

            $hamletQuery = $pdo->prepare('SELECT id FROM ap WHERE id = ?');
            $hamletQuery->execute([$hamletId]);
            if (!$hamletQuery->fetchColumn()) {
                respond(404, ['error' => 'Không tìm thấy ấp được chọn.']);
            }

            $pdo->beginTransaction();
            $confirmedHistoryId = null;
            try {
                $assessmentQuery = $pdo->prepare(
                    'SELECT assessments.criterion_id, assessments.score, assessments.self_evidence,
                            assessments.evidence_links, assessments.updated_at,
                            criteria.title AS criterion_title, criteria.max_points
                     FROM diem_danh_gia AS assessments
                     JOIN tieu_chi_danh_gia AS criteria ON criteria.id = assessments.criterion_id
                     WHERE assessments.hamlet_id = ?
                     ORDER BY assessments.criterion_id
                     FOR UPDATE'
                );
                $assessmentQuery->execute([$hamletId]);
                $assessments = $assessmentQuery->fetchAll();
                $existingApprovalQuery = $pdo->prepare(
                    'SELECT confirmed_by FROM xac_nhan_diem WHERE hamlet_id = ? FOR UPDATE'
                );
                $existingApprovalQuery->execute([$hamletId]);
                $existingApproval = $existingApprovalQuery->fetchColumn();

                if ($approved && $existingApproval !== false) {
                    $pdo->commit();
                    $approvalQuery = $pdo->prepare(
                        'SELECT approvals.confirmed_at, users.username AS confirmed_by
                         FROM xac_nhan_diem AS approvals
                         JOIN tai_khoan AS users ON users.id = approvals.confirmed_by
                         WHERE approvals.hamlet_id = ?'
                    );
                    $approvalQuery->execute([$hamletId]);
                    respond(200, [
                        'approval' => $approvalQuery->fetch() ?: null,
                        'already_confirmed' => true,
                    ]);
                }

                if ($approved) {
                    if ($requestedHistoryId !== null) {
                        $pendingHistoryQuery = $pdo->prepare(
                            'SELECT id FROM lich_su_danh_gia
                             WHERE hamlet_id = ?
                             ORDER BY id DESC LIMIT 1 FOR UPDATE'
                        );
                        $pendingHistoryQuery->execute([$hamletId]);
                    } else {
                        $pendingHistoryQuery = $pdo->prepare(
                            'SELECT id FROM lich_su_danh_gia
                             WHERE hamlet_id = ? AND confirmed_by IS NULL
                             ORDER BY id DESC LIMIT 1 FOR UPDATE'
                        );
                        $pendingHistoryQuery->execute([$hamletId]);
                    }
                    $pendingHistoryId = $pendingHistoryQuery->fetchColumn();
                    if (
                        $requestedHistoryId !== null &&
                        ($pendingHistoryId === false || (int) $pendingHistoryId !== $requestedHistoryId)
                    ) {
                        $pdo->commit();
                        respond(409, ['error' => 'Lần đánh giá đã thay đổi. Hãy tải lại trang trước khi xác nhận.']);
                    }
                    $hasUnsubmittedAssessment = count(array_filter(
                        $assessments,
                        static fn (array $assessment): bool => $assessment['updated_at'] !== null
                    )) > 0;
                    if (
                        $assessments === [] ||
                        ($pendingHistoryId === false && !$hasUnsubmittedAssessment)
                    ) {
                        $pdo->commit();
                        respond(409, ['error' => 'Ấp này chưa lưu điểm để quản trị viên xác nhận.']);
                    }

                    if ($pendingHistoryId !== false) {
                        $historyId = (int) $pendingHistoryId;
                        if (!saveCommuneHistoryScores($pdo, $historyId, $communeScores)) {
                            $pdo->rollBack();
                            respond(409, ['error' => 'Các tiêu chí hoặc giới hạn điểm của lần đánh giá đã thay đổi. Hãy tải lại trang.']);
                        }
                        $confirmedHistoryId = $historyId;
                        $confirmHistoryQuery = $pdo->prepare(
                            'UPDATE lich_su_danh_gia
                             SET confirmed_by = ?, confirmed_at = CURRENT_TIMESTAMP
                             WHERE id = ?'
                        );
                        $confirmHistoryQuery->execute([$user['id'], $pendingHistoryId]);
                    } else {
                        $historyId = saveAssessmentHistory(
                            $pdo,
                            $hamletId,
                            (int) $user['id'],
                            $assessments,
                            (int) $user['id']
                        );
                        if (!saveCommuneHistoryScores($pdo, $historyId, $communeScores)) {
                            $pdo->rollBack();
                            respond(409, ['error' => 'Các tiêu chí hoặc giới hạn điểm đã thay đổi. Hãy tải lại trang.']);
                        }
                        $confirmedHistoryId = $historyId;
                    }
                    $approvalQuery = $pdo->prepare(
                        'INSERT INTO xac_nhan_diem (hamlet_id, confirmed_by) VALUES (?, ?)'
                    );
                    $approvalQuery->execute([$hamletId, $user['id']]);
                    $resetAssessmentQuery = $pdo->prepare(
                        "UPDATE diem_danh_gia
                         SET score = 0, self_evidence = '', evidence_links = '', updated_at = NULL
                         WHERE hamlet_id = ?"
                    );
                    $resetAssessmentQuery->execute([$hamletId]);
                } else {
                    $approvalQuery = $pdo->prepare(
                        'DELETE FROM xac_nhan_diem WHERE hamlet_id = ?'
                    );
                    $approvalQuery->execute([$hamletId]);
                }
                $pdo->commit();
            } catch (Throwable $error) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                throw $error;
            }

            $approval = null;
            $confirmedHistory = null;
            if ($approved) {
                $latestHistoryQuery = $pdo->prepare(
                    'SELECT id, submitted_at FROM lich_su_danh_gia
                     WHERE hamlet_id = ? AND id = ?'
                );
                $latestHistoryQuery->execute([$hamletId, $confirmedHistoryId]);
                $confirmedHistory = $latestHistoryQuery->fetch();
                $approvalQuery = $pdo->prepare(
                    'SELECT approvals.confirmed_at, users.username AS confirmed_by
                     FROM xac_nhan_diem AS approvals
                     JOIN tai_khoan AS users ON users.id = approvals.confirmed_by
                     WHERE approvals.hamlet_id = ?'
                );
                $approvalQuery->execute([$hamletId]);
                $approval = $approvalQuery->fetch();
            }
            respond(200, [
                'approval' => $approval ?: null,
                'history_id' => $confirmedHistoryId === null ? null : (int) $confirmedHistoryId,
                'submitted_at' => $confirmedHistory['submitted_at'] ?? null,
            ]);
        }

        respond(400, ['error' => 'Tác vụ không hợp lệ.']);
    }

    if ($method === 'GET') {
        $user = requireAuthentication();

        $hamletsQuery = $pdo->query('SELECT id, name, sort_order FROM ap ORDER BY sort_order');
        $allHamlets = $hamletsQuery->fetchAll();
        if ($user['role'] === 'admin') {
            $visibleHamlets = $allHamlets;
        } else {
            $visibleHamlets = array_values(array_filter(
                $allHamlets,
                static fn (array $hamlet): bool => (int) $hamlet['id'] === $user['hamlet_id']
            ));
            if ($visibleHamlets === []) {
                respond(403, ['error' => 'Tài khoản không được gán cho ấp hợp lệ. Hãy liên hệ quản trị viên.']);
            }
        }

        $criteria = $pdo->query(
            'SELECT id, title, evidence_requirements, max_points, sort_order
             FROM tieu_chi_danh_gia ORDER BY sort_order'
        )->fetchAll();

        $hamletIds = array_map(static fn (array $hamlet): int => (int) $hamlet['id'], $visibleHamlets);
        $placeholders = implode(',', array_fill(0, count($hamletIds), '?'));
        $assessmentsQuery = $pdo->prepare(
            "SELECT hamlet_id, criterion_id, score, self_evidence, evidence_links, updated_at
             FROM diem_danh_gia
             WHERE hamlet_id IN ({$placeholders})
             ORDER BY hamlet_id, criterion_id"
        );
        $assessmentsQuery->execute($hamletIds);
        $approvalsQuery = $pdo->prepare(
            "SELECT approvals.hamlet_id, approvals.confirmed_at,
                    users.username AS confirmed_by
             FROM xac_nhan_diem AS approvals
             JOIN tai_khoan AS users ON users.id = approvals.confirmed_by
             WHERE approvals.hamlet_id IN ({$placeholders})
             ORDER BY approvals.hamlet_id"
        );
        $approvalsQuery->execute($hamletIds);
        $history = [];
        $historyItems = [];
        $pendingAssessments = [];
        $pendingAssessmentItems = [];
        $pendingQuery = $pdo->prepare(
            "SELECT history.id, history.hamlet_id, history.submitted_at, history.total_score,
                    history.confirmed_at, history.confirmed_by,
                    submitter.username AS submitted_by, confirmer.username AS confirmed_by_name
             FROM lich_su_danh_gia AS history
             JOIN (
                 SELECT hamlet_id, MAX(id) AS latest_id
                 FROM lich_su_danh_gia
                 WHERE hamlet_id IN ({$placeholders})
                 GROUP BY hamlet_id
             ) AS latest ON latest.latest_id = history.id
             JOIN tai_khoan AS submitter ON submitter.id = history.submitted_by
             LEFT JOIN tai_khoan AS confirmer ON confirmer.id = history.confirmed_by
             ORDER BY history.id DESC"
        );
        $pendingQuery->execute($hamletIds);
        $seenPendingHamlets = [];
        foreach ($pendingQuery->fetchAll() as $pending) {
            $pending['id'] = (int) $pending['id'];
            $pending['hamlet_id'] = (int) $pending['hamlet_id'];
            $pending['total_score'] = (int) $pending['total_score'];
            if (isset($seenPendingHamlets[$pending['hamlet_id']])) {
                continue;
            }
            $seenPendingHamlets[$pending['hamlet_id']] = true;
            $pendingAssessments[] = $pending;
        }
        $pendingIds = array_column($pendingAssessments, 'id');
        if ($pendingIds !== []) {
            $pendingPlaceholders = implode(',', array_fill(0, count($pendingIds), '?'));
            $pendingItemsQuery = $pdo->prepare(
                "SELECT history_id, criterion_id, criterion_title, max_points, score, commune_score,
                        self_evidence, evidence_links
                 FROM chi_tiet_lich_su_danh_gia
                 WHERE history_id IN ({$pendingPlaceholders})
                 ORDER BY history_id DESC, criterion_id"
            );
            $pendingItemsQuery->execute($pendingIds);
            $pendingAssessmentItems = $pendingItemsQuery->fetchAll();
        }
        if ($user['role'] === 'hamlet') {
            $historyQuery = $pdo->prepare(
                'SELECT history.id, history.hamlet_id, history.submitted_at, history.confirmed_at,
                        history.total_score, confirmer.username AS confirmed_by,
                        submitter.username AS submitted_by
                 FROM lich_su_danh_gia AS history
                 JOIN tai_khoan AS submitter ON submitter.id = history.submitted_by
                 LEFT JOIN tai_khoan AS confirmer ON confirmer.id = history.confirmed_by
                 WHERE history.hamlet_id = ?
                 ORDER BY history.submitted_at DESC, history.id DESC'
            );
            $historyQuery->execute([$user['hamlet_id']]);
            $history = $historyQuery->fetchAll();
            $historyIds = array_map(static fn (array $entry): int => (int) $entry['id'], $history);
        } else {
            $historyIds = [];
        }
        if ($historyIds !== []) {
            $historyPlaceholders = implode(',', array_fill(0, count($historyIds), '?'));
            $historyItemsQuery = $pdo->prepare(
                "SELECT history_id, criterion_id, criterion_title, max_points, score, commune_score,
                        self_evidence, evidence_links
                 FROM chi_tiet_lich_su_danh_gia
                 WHERE history_id IN ({$historyPlaceholders})
                 ORDER BY history_id DESC, criterion_id"
            );
            $historyItemsQuery->execute($historyIds);
            $historyItems = $historyItemsQuery->fetchAll();
        }

        $response = [
            'user' => $user,
            'csrf_token' => $_SESSION['csrf_token'] ?? '',
            'hamlets' => $visibleHamlets,
            'criteria' => $criteria,
            'assessments' => $assessmentsQuery->fetchAll(),
            'approvals' => $approvalsQuery->fetchAll(),
            'assessment_history' => $history,
            'assessment_history_items' => $historyItems,
            'pending_assessments' => $pendingAssessments,
            'pending_assessment_items' => $pendingAssessmentItems,
        ];
        if ($user['role'] === 'admin') {
            $response['users'] = $pdo->query(
                "SELECT users.id, users.username, users.role, users.hamlet_id,
                        hamlets.name AS hamlet_name, users.created_at
                 FROM tai_khoan AS users
                 LEFT JOIN ap AS hamlets ON hamlets.id = users.hamlet_id
                 ORDER BY users.created_at DESC"
            )->fetchAll();
        }
        respond(200, $response);
    }

    if ($method === 'PUT') {
        $user = requireAuthentication();
        requireCsrfToken();

        $body = readJsonBody();
        $hamletId = filter_var($body['hamlet_id'] ?? null, FILTER_VALIDATE_INT);
        $entries = $body['assessments'] ?? null;
        if ($hamletId === false || $hamletId === null || !is_array($entries)) {
            respond(400, ['error' => 'Cần có hamlet_id và danh sách assessments hợp lệ.']);
        }
        if ($user['role'] === 'hamlet' && $hamletId !== $user['hamlet_id']) {
            respond(403, ['error' => 'Tài khoản thường chỉ được lưu điểm cho ấp đã gán.']);
        }

        $maxPointsById = [];
        foreach ($pdo->query('SELECT id, max_points FROM tieu_chi_danh_gia')->fetchAll() as $criterion) {
            $maxPointsById[(int) $criterion['id']] = (int) $criterion['max_points'];
        }
        $hamletExists = $pdo->prepare('SELECT 1 FROM ap WHERE id = ?');
        $hamletExists->execute([$hamletId]);
        if (!$hamletExists->fetchColumn()) {
            respond(404, ['error' => 'Không tìm thấy ấp được chọn.']);
        }
        if (count($entries) !== count($maxPointsById)) {
            respond(400, ['error' => 'Danh sách chấm điểm phải có đủ tất cả nội dung đánh giá.']);
        }

        $normalizedEntries = [];
        foreach ($entries as $entry) {
            if (!is_array($entry)) {
                respond(400, ['error' => 'Một nội dung chấm điểm không hợp lệ.']);
            }
            $criterionId = filter_var($entry['criterion_id'] ?? null, FILTER_VALIDATE_INT);
            $score = filter_var($entry['score'] ?? null, FILTER_VALIDATE_INT);
            if (
                $criterionId === false ||
                $criterionId === null ||
                !array_key_exists($criterionId, $maxPointsById) ||
                $score === false ||
                $score === null ||
                $score < 0 ||
                $score > $maxPointsById[$criterionId]
            ) {
                respond(400, ['error' => 'Mã nội dung hoặc điểm số không hợp lệ.']);
            }
            if (isset($normalizedEntries[$criterionId])) {
                respond(400, ['error' => 'Danh sách có nội dung đánh giá bị lặp.']);
            }

            $selfEvidence = $entry['self_evidence'] ?? '';
            $evidenceLinks = $entry['evidence_links'] ?? '';
            if (!is_string($selfEvidence) || !is_string($evidenceLinks)) {
                respond(400, ['error' => 'Nội dung minh chứng phải là văn bản.']);
            }
            $normalizedEntries[$criterionId] = [
                'criterion_id' => $criterionId,
                'score' => $score,
                'self_evidence' => $selfEvidence,
                'evidence_links' => $evidenceLinks,
            ];
        }
        if (count($normalizedEntries) !== count($maxPointsById)) {
            respond(400, ['error' => 'Danh sách chấm điểm còn thiếu nội dung đánh giá.']);
        }

        $upsert = $pdo->prepare(
            'INSERT INTO diem_danh_gia
                (hamlet_id, criterion_id, score, self_evidence, evidence_links, updated_at)
             VALUES
                (:hamlet_id, :criterion_id, :score, :self_evidence, :evidence_links, CURRENT_TIMESTAMP)
             ON DUPLICATE KEY UPDATE
                score = VALUES(score),
                self_evidence = VALUES(self_evidence),
                evidence_links = VALUES(evidence_links),
                updated_at = CURRENT_TIMESTAMP'
        );

        $pdo->beginTransaction();
        $historyId = 0;
        try {
            foreach ($normalizedEntries as $entry) {
                $upsert->execute([
                    'hamlet_id' => $hamletId,
                    'criterion_id' => $entry['criterion_id'],
                    'score' => $entry['score'],
                    'self_evidence' => $entry['self_evidence'],
                    'evidence_links' => $entry['evidence_links'],
                ]);
            }
            $savedAssessmentQuery = $pdo->prepare(
                'SELECT assessments.criterion_id, assessments.score, assessments.self_evidence,
                        assessments.evidence_links, criteria.title AS criterion_title,
                        criteria.max_points
                 FROM diem_danh_gia AS assessments
                 JOIN tieu_chi_danh_gia AS criteria ON criteria.id = assessments.criterion_id
                 WHERE assessments.hamlet_id = ?
                 ORDER BY assessments.criterion_id'
            );
            $savedAssessmentQuery->execute([$hamletId]);
            $historyId = saveAssessmentHistory($pdo, $hamletId, (int) $user['id'], $savedAssessmentQuery->fetchAll());
            $clearApproval = $pdo->prepare(
                'DELETE FROM xac_nhan_diem WHERE hamlet_id = ?'
            );
            $clearApproval->execute([$hamletId]);
            $resetAssessmentQuery = $pdo->prepare(
                "UPDATE diem_danh_gia
                 SET score = 0, self_evidence = '', evidence_links = '', updated_at = NULL
                 WHERE hamlet_id = ?"
            );
            $resetAssessmentQuery->execute([$hamletId]);
            $pdo->commit();
        } catch (Throwable $error) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $error;
        }

        $submittedAtQuery = $pdo->prepare('SELECT submitted_at FROM lich_su_danh_gia WHERE id = ?');
        $submittedAtQuery->execute([$historyId]);
        respond(200, [
            'message' => 'Đã lưu dữ liệu chấm điểm vào lịch sử và làm trống phiếu hiện tại.',
            'history_id' => $historyId,
            'submitted_at' => $submittedAtQuery->fetchColumn(),
        ]);
    }

    header('Allow: GET, POST, PUT');
    respond(405, ['error' => 'Phương thức này không được hỗ trợ.']);
} catch (Throwable $error) {
    error_log($error->__toString());
    respond(500, ['error' => 'Không thể xử lý yêu cầu với cơ sở dữ liệu. Kiểm tra cấu hình và nhật ký PHP.']);
}
