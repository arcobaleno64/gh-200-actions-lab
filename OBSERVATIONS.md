# 實測紀錄

| 實驗 | 學習站的說法 | 預期 | 實際觀察 | 一致？ |
| ---- | ------------ | ---- | -------- | ------ |
| 1 | schedule 與 workflow_dispatch 只在預設分支的檔案上觸發 | 功能分支沒有執行、不能手動觸發 | （待填） | |
| 1 | 排程的 GITHUB_SHA 是預設分支的最後 commit | 等於 main 的最新 commit | （待填） | |
| 2 | pull_request 的 GITHUB_SHA 是 PR 合併 commit | 不等於 PR 分支尖端 commit | 2026-11-03：GITHUB_SHA=2eccd195…，GITHUB_REF=refs/pull/1/merge；PR 分支尖端（head.sha）是 0444fc0d…；2eccd195 等於 refs/pull/1/merge 所指的 commit | 一致 |
| 2 | push 的 GITHUB_SHA 是推送的最新 commit | 等於該分支尖端 commit | 2026-11-03：push 到 lab02/a，GITHUB_SHA=0444fc0d…（分支尖端），GITHUB_REF=refs/heads/lab02/a；在 main 以 workflow_dispatch 執行時 SHA=bb2abd8a…、REF=refs/heads/main | 一致 |
| 3 | github.event.inputs 把 boolean 轉成字串 | 與 true 比較的步驟不執行 | 2026-11-03：dry_run=true 時 raw=true，步驟 b（== 'true'）執行、步驟 c（== true）略過；dry_run=false 時 b 與 c 都略過 | 一致 |
| 3 | inputs 保留 boolean 型別 | `if: inputs.dry_run` 在 true 時執行 | 2026-11-03：dry_run=true 時步驟 a 執行；dry_run=false 時 a 略過 | 一致 |
| 4 | fail-fast 啟用時一個組合失敗會取消其他組合（預設值章內未核對） | 沒設定時也被取消 | 2026-11-03：沒設 fail-fast，`default-failfast (1)` 失敗，(2)(3)(4) 全部 cancelled | 一致，且確認預設為啟用 |
| 4 | fail-fast: false 時其他組合照常完成 | (2)(3)(4) 成功 | 2026-11-03：`failfast-false (1)` 失敗，(2)(3)(4) 都是 success | 一致 |
| 4 | include 與 exclude 的 job 數 | 4 − 1 + 1 = 4 個 | 2026-11-03：count 共 4 個 job：(macos-latest, 20)、(ubuntu-latest, 16)、(ubuntu-latest, 18)、(windows-latest, 18)；(windows-latest, 16) 不存在 | 一致 |
| 4 | 矩陣 job 的顯示名稱（章內未核對） | `job-id (值, 值)` | 2026-11-03：單一變數是 `default-failfast (1)`；兩個變數是 `count (ubuntu-latest, 18)`，include 新增的組合也同格式 | 確認 |
| 5 | job 直接在 runner 上、有 ports 時用 localhost 連服務 | localhost:6379 回 +PONG | 2026-11-03：`on-runner-ports` 的 localhost:6379 回 `+PONG` | 一致 |
| 5 | 同上，用服務標籤 redis 連 | 解析不到 | 2026-11-03：`redis:6379` 回 `Temporary failure in name resolution` | 一致 |
| 5 | job 直接在 runner 上、沒有 ports | localhost 連不上 | 2026-11-03：`on-runner-noports` 的 localhost:6379 回 `Connection refused`，redis 解析不到 | 一致 |
| 5 | job 在容器內時用服務標籤連 | redis:6379 回 +PONG，localhost 連不上 | 2026-11-03：`in-container` 的 redis:6379 回 `+PONG`，localhost:6379 回 `Connection refused` | 一致 |
| 5 | services 的 options 帶 --health-cmd（章內未核對） | 被接受 | 2026-11-03：job 日誌出現 `(health: starting)` 後變 `healthy`，再執行步驟 | 確認 |
