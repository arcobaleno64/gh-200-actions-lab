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
| 6 | outcome 是套用 continue-on-error 之前的結果 | 步驟 outcome == 'failure' 會執行 | 2026-11-03：`lint` 失敗並 continue-on-error，印出 `outcome=failure conclusion=success`；`outcome == 'failure'` 的步驟執行 | 一致 |
| 6 | conclusion 是套用之後的結果 | `conclusion == 'failure'` 略過，`== 'success'` 執行 | 2026-11-03：`conclusion == 'failure'` 步驟 skipped，`conclusion == 'success'` 步驟 success | 一致 |
| 6 | jobs.<id>.if 不能用 secrets | 解析時被拒絕 | 2026-11-03：run 41581867144，`(Line: 9, Col: 9): Unrecognized named-value: 'secrets'`，沒有 job | 一致 |
| 6 | steps.if 不能用 secrets | 解析時被拒絕 | 2026-11-03：run 41581868608，`(Line: 11, Col: 13): Unrecognized named-value: 'secrets'` | 一致 |
| 6 | jobs.<id>.if 不能用 matrix | 解析時被拒絕 | 2026-11-03：run 41581865573，`Unrecognized named-value: 'matrix'` | 一致 |
| 6 | 把 secret 放進 job 層級 env 再判斷可行 | 未設定的 secret 比較為 false | 2026-11-03：`HAS_TOKEN=[false]`，`if: env.HAS_TOKEN == 'true'` 的步驟 skipped | 一致 |
| 7 | 分支能還原預設分支的快取 | b1 用 restore-keys `lab07-main-` 命中 | 2026-11-03：在 `lab07/b1` 命中 `lab07-main-1`（`cache-hit=false` 因為是 restore-keys 的部分比對，`content=main`） | 一致 |
| 7 | 兄弟分支拿不到 | b2 看不到 b1 的快取 | 2026-11-03：b1 存入 `lab07-b1-1` 後，在 `lab07/b2` 用 restore-keys `lab07-b1-` 沒有命中；同時列 `lab07-b1-` 與 `lab07-main-` 時回 `lab07-main-1` | 一致 |
| 7 | 子分支的快取預設分支拿不到 | main 看不到 b1 的快取 | 2026-11-03：在 `main` 用 restore-keys `lab07-b1-` 沒有命中 | 一致 |
| 7 | key 的前綴先於 restore-keys | key=`lab07-p`、restore-keys=`lab07-q-` 回 p 系列 | 2026-11-03：命中 `lab07-p-2`，沒有選 `lab07-q-1` | 一致 |
| 7 | restore-keys 依列出順序 | 先列者優先 | 2026-11-03：列 `q-,p-` 命中 `lab07-q-1`；列 `p-,q-` 命中 `lab07-p-2` | 一致 |
| 7 | 同一個前綴符合多個時用最近建立的 | p-1 較舊、p-2 較新 → 選 p-2 | 2026-11-03：`lab07-p-` 命中 `lab07-p-2`（p-1 建立於 07:35:25，p-2 於 07:35:43 UTC） | 一致 |
| 7 | 完全相同的 key 優先於前綴 | key=`lab07-p-1` 命中 p-1 | 2026-11-03：`cache-hit=true`，`matched=lab07-p-1`，`content=p1`（沒有選較新的 p-2） | 一致 |
| 8 | v4 成品不可變，同名不能再上傳 | 第二次上傳失敗 | 2026-11-03：同一次執行第二次上傳 `build`，`##[error]Failed to CreateArtifact: ... (409) Conflict: an artifact with this name already exists on the workflow run`，步驟 outcome=failure | 一致 |
| 8 | 上傳回傳 digest，下載端比對 | 兩端 SHA256 相同 | 2026-11-03：上傳 `SHA256 digest of uploaded artifact zip is b49e9e16…`，下載 `SHA256 digest of downloaded artifact is b49e9e16…` | 一致 |
| 8 | 同一次執行可下載稍早上傳的成品 | 成功 | 2026-11-03：`download-same-run` 讀到 `first` | 一致 |
| 8 | 跨執行下載要提供 run-id 與 token | 提供後成功 | 2026-11-03：`run-id` 加 `github-token` 成功讀到 `first`；`with_token=false`（傳空字串）也成功，因為空字串使用預設的 `github.token`，沒有測到「沒有 token」 | 部分一致；token 的必要性未驗證 |
| 8 | REST 下載回 302，網址在 Location | 302 | 2026-11-03：`HTTP/1.1 302 Found`，`Location` 指向 `productionresultssa11.blob.core.windows.net` | 一致 |
| 8 | 下載網址只有 1 分鐘有效 | 75 秒後失敗 | 2026-11-03：**75 秒後仍回 200**；網址的 `st=07:44:54Z`、`se=07:54:59Z`，有效約 10 分鐘 | **不一致**（官方頁面寫 1 分鐘，實測約 10 分鐘） |
| 8 | archive_format 只能是 zip | tar 失敗 | 2026-11-03：`.../<id>/tar` 回 404 | 一致 |
| 8 | 成品物件有 expires_at；retention-days 可縮短 | 約 1 天後 | 2026-11-03：`retention-days: 1`，建立 `2026-11-03T07:43:11Z`，`expires_at=2026-11-04T07:43:10Z`，`expired=false` | 一致 |
| 8 | 刪除執行會連同成品一起刪除 | 成品消失 | 2026-11-03：刪除 run 41598226131（回 204）後該 run 的成品不再出現在列表，其他兩次執行的成品還在 | 一致 |
| 9 | 重跑沿用原本的 GITHUB_SHA 與 GITHUB_REF | 第 2 次嘗試的 SHA 等於第 1 次 | 2026-11-03：第 1 次 `0941e519…`；推新 commit 後 main 為 `cc190e5e…`；`--failed` 重跑（run_attempt=2）的 `GITHUB_SHA` 與 checkout 後的 HEAD 仍是 `0941e519…`，遠端 main 已是 `cc190e5e…` | 一致 |
| 9 | 只重跑失敗的 job | 成功的 job 不重跑 | 2026-11-03：`--failed` 後 `ok` job 的日誌仍是 `attempt=[1]`（沿用第 1 次的結果，沒有重新執行）；`check` 重跑成功 | 一致 |
| 9 | 只重跑失敗 job 時，封存檔只含重跑的 job | 只有 check | 2026-11-03：第 2 次嘗試的 logs 封存檔只有 `0_check.txt` 與 `check/` 的檔案，沒有 `ok` | 一致 |
| 9 | 每次重跑 run_attempt 加一，且可讀各次嘗試的 job | 章內未核對 | 2026-11-03：run_attempt 依序為 1、2、3…6；`/runs/<id>/attempts/1/jobs` 仍可讀到第 1 次的 `check=failure` | 確認 |
| 9 | Enable debug logging（--debug）啟用步驟除錯與 runner 診斷 | 有除錯行與 runner-diagnostic-logs | 2026-11-03：`gh run rerun --debug` 的第 3 次嘗試有 268 行 `##[debug]`（含 `##[debug]lab09 debug message`），封存檔含 `runner-diagnostic-logs/<job id>-check.zip` 與 `-ok.zip`；沒有 `--debug` 的第 2 次嘗試有 0 行 | 一致 |
| 9 | ACTIONS_STEP_DEBUG 設成 variable 為 true 時啟用 | 有除錯行 | 2026-11-03：只有 variable=true 時，第 4 次嘗試有 252 行 `##[debug]` | 一致 |
| 9 | variable 與 secret 同時存在時 secret 優先 | secret=false 時沒有除錯行 | 2026-11-03：variable=true 加 secret=false，第 5 次嘗試 0 行；刪除 variable 後只剩 secret=false，第 6 次嘗試 0 行 | 一致 |
