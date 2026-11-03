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
| 10 | 呼叫端明確傳入 secret 後，被呼叫端才讀得到 | explicit 有 token | 2026-11-03：`call-explicit` 的 `has-token-input=[true]`；`call-none`（不傳）為 `false` | 一致 |
| 10 | 被呼叫端不能直接讀呼叫端 repo 的 secret，除非 `secrets: inherit` | none/explicit 讀不到，inherit 讀得到 | 2026-11-03：被呼叫端直接讀 `secrets.LAB10_REPO_SECRET`：`call-none`=false、`call-explicit`=false、`call-inherit`=true（`inherit` 時宣告的 `token` 輸入仍是 false，因為沒有同名 secret） | 一致 |
| 10 | 被呼叫端的 `workflow_call.outputs` 可傳回呼叫端 | 讀到 explicit-done | 2026-11-03：`needs.call-explicit.outputs.result` 為 `explicit-done` | 一致 |
| 10 | 被呼叫端的 `github` context 是呼叫端的 | event、workflow 屬於呼叫端 | 2026-11-03：`event=workflow_dispatch`、`workflow=lab10-caller`，`GITHUB_SHA` 與呼叫端相同 | 一致 |
| 10 | 複合 action 透過 input 接收 secret | 成功，輸出可讀 | 2026-11-03：`has-token-input=[true]`，`steps.c.outputs.result=composite-done`；`GITHUB_JOB` 為呼叫它的 job（`composite`） | 一致 |
| 10 | 複合 action 不能直接讀 `secrets` | 失敗 | 2026-11-03：`##[error]... action.yml (Line: 8, Col: 21): Unrecognized named-value: 'secrets'`；`Failed to load .../action.yml`；步驟因 `continue-on-error` 顯示 conclusion=success，`outcome=failure` | 一致 |
| 10 | 呼叫端 job 不能有 `steps` | 解析時被拒絕 | 2026-11-03：`Invalid workflow file ... (Line: 11, Col: 5): Unexpected value 'steps'` | 一致 |
| 10 | 呼叫端 job 不能有 `environment` | 解析時被拒絕 | 2026-11-03：`(Line: 11, Col: 5): Unexpected value 'environment'` | 一致 |
| 10 | `uses` 不能使用運算式 | 解析時被拒絕 | 2026-11-03：`(Line: 8, Col: 11): A template expression is not allowed in this context` | 一致 |
| 10 | 呼叫端 job 不能與 `runs-on` 並存 | 解析時被拒絕 | 2026-11-03：有 `runs-on` 時該 job 被當成一般 job 解析，錯誤是 `Unexpected value 'uses'`、`Unexpected value 'with'`（不是指 `runs-on` 本身） | 一致（錯誤訊息指向 `uses`／`with`） |
| 11 | Docker 容器 action 只能在 Linux runner 執行 | Windows 失敗 | 2026-11-03：`windows-latest` 上 `##[error]Container action is only supported on Linux`，步驟 outcome=failure；同一個 action 在 ubuntu 成功 | 一致 |
| 11 | JavaScript action 在 Windows 也能執行 | 成功 | 2026-11-03：`windows-latest` 上 `lab11-js` 的 main 與 post 都執行，outcome=success | 一致 |
| 11 | JS action 以 `INPUT_<名稱>` 環境變數收輸入 | 變數存在 | 2026-11-03：輸入 `who-to-greet` 的環境變數名稱是 `INPUT_WHO-TO-GREET`（連字號保留、字母大寫）；未傳入但有 `default` 的輸入也會出現 | 一致 |
| 11 | `required: true` 的輸入沒傳會報錯 | 失敗 | 2026-11-03：`must-have` 宣告 `required: true` 但呼叫端沒傳，步驟成功，`INPUT_MUST-HAVE` 為空字串 | 章節未明確說；實測 runner 不強制 required |
| 11 | JS／Docker 的輸出靠 `$GITHUB_OUTPUT` | 後續步驟讀得到 | 2026-11-03：`steps.js.outputs.greeting` 為 `Hello Mona`；`steps.dk.outputs.greeting` 為 `Hello Octo`（metadata 只宣告 `description`，沒有 `value`） | 一致 |
| 11 | `post` 可讀到 `main` 寫入 `$GITHUB_STATE` 的值 | `STATE_marker` | 2026-11-03：`post` 印出 `state-marker=[from-main]` | 一致 |
| 11 | Docker action 的輸入透過 `args` 傳入 | 容器收到參數 | 2026-11-03：`args-count=[1] arg1=[Octo]`；容器內也看得到 `INPUT_WHO-TO-GREET=Octo`（與章節引用的官方敘述「不會自動成為 INPUT_ 環境變數」不同）；容器內 `GITHUB_WORKSPACE=/github/workspace`，`GITHUB_OUTPUT` 已設定 | 部分不一致（INPUT_ 變數實測存在） |
| 11 | 複合 action 輸出需要 `value` | `steps.cp.outputs.greeting` | 2026-11-03：`composite-output=[Hello Cat]` | 一致 |
| 11 | 複合 action 內以 `inputs` context 取輸入 | 取得 | 2026-11-03：`${{ inputs.who-to-greet }}` 為 `Cat`；環境中沒有 `INPUT_*` 變數（`input-env-keys=[]`）；`GITHUB_ACTION_PATH` 有設定，JS action 內沒有 | 確認 |
| 11 | `pre` 步驟在本機（`./`）action 的行為 | 章內未核對 | 2026-11-03：宣告 `pre: pre.js` 的本機 action 出現警告 `pre execution is not supported for local action from './.github/actions/lab11-js'`，`pre.js` 沒有執行（`main`、`post` 有）。遠端 action 的 `pre` 未測 | 新發現 |
| 12 | `run` 內直接寫運算式會先展開成腳本文字 | 日誌的 Run 區塊是展開後內容 | 2026-11-03：輸入 `x"; echo INJECTED-SHELL; echo "` 時，Run 區塊顯示 `echo "RESULT12 A greeting=[Hello x"; echo INJECTED-SHELL; echo "]"` | 一致 |
| 12 | 打斷引號後，注入的指令會被執行 | 多印一行 | 2026-11-03：步驟 A 多輸出獨立一行 `INJECTED-SHELL`（第二個 `echo` 真的執行） | 一致 |
| 12 | 經 `env` 再用 `$NAME` 取值，內容只是字串 | 不執行 | 2026-11-03：同一輸入下步驟 B 輸出 `RESULT12 B greeting=[Hello x"; echo INJECTED-SHELL; echo "]`，沒有獨立的 `INJECTED-SHELL` 行 | 一致 |
| 12 | `github-script` 內直接寫運算式同樣可被注入 | 單引號被打斷後執行 | 2026-11-03：輸入 `x'); core.info('INJECTED-JS` 時，步驟 C 的腳本變成 `core.info('...[Hello x'); core.info('INJECTED-JS]')`，輸出獨立一行 `INJECTED-JS]`；用雙引號的 shell 酬載在這個單引號字串內沒有效果（只是字串） | 一致（酬載要配合引號種類） |
| 12 | 經 `process.env` 取值只是字串 | 不執行 | 2026-11-03：步驟 D 輸出 `RESULT12 D greeting=[Hello x'); core.info('INJECTED-JS]`，沒有獨立行 | 一致 |
| 12 | 含換行的不受信任文字附加到 `GITHUB_ENV` 會多設變數 | `LAB12_INJECTED` 被設定 | 2026-11-03：輸入 `first` 換行 `LAB12_INJECTED=yes`，E2 輸出 `note=[first] injected-var=[yes]`；日誌也列出新增的 `LAB12_INJECTED: yes`。單行輸入時 `injected-var=[unset]` | 一致 |
| 12 | 同一個 `env` 方式在 shell 與 JavaScript 兩邊都能避免注入 | B、D 都安全 | 2026-11-03：四組輸入下 B、D 皆只輸出字串 | 一致 |
| 13 | 預設為唯讀時，沒寫 `permissions` 的工作流程不能寫入 | 建立標籤被擋 | 2026-11-03：repository 設定為 `default_workflow_permissions=read`（只讀取）；`lab13-default` 建立標籤回 `403` | 一致 |
| 13 | 工作流程層級 `contents: read` 時 job 繼承 | 寫入被擋 | 2026-11-03：`inherits-workflow-level` 建立標籤回 `403` | 一致 |
| 13 | job 層級 `permissions` 取代工作流程層級 | job 可以有不同權限 | 2026-11-03：同一個工作流程（頂層 `contents: read`），`job-level-issues-write` 建立標籤回 `201`，與繼承的 job 的 `403` 不同 | 一致 |
| 13 | `permissions: {}` 不給任何權限 | 寫入被擋 | 2026-11-03：建立標籤回 `403` | 一致（讀取無法驗證，見下列） |
| 13 | `permissions: write-all` 給全部權限 | 寫入成功 | 2026-11-03：建立標籤回 `201` | 一致 |
| 13 | 讀取權限能被 `permissions` 限制 | 讀取被擋 | 2026-11-03：公開 repo 上，`permissions: {}` 的 token 讀 `contents` 回 200，**未認證的請求也回 200** | **無法驗證**（公開 repo 讀取不需要權限；要驗證需用私有 repo） |
| 13 | 指定單一權限後，其餘權限變為 none | 其餘權限被拿掉 | 2026-11-03：同上，公開 repo 的讀取無法分辨；`issues: write` 單獨設定時 `contents` 與 `actions` 讀取仍回 200 | **無法驗證** |
| 13 | `GITHUB_TOKEN` 引發的事件不會建立新的執行 | 開 issue 不觸發 | 2026-11-03：`GITHUB_TOKEN`（`actions` 開出的 issue #2）沒有觸發 `lab13-target` 的 `issues: opened`；user 帳號開的 issue #3 觸發了（actor=arcobaleno64） | 一致 |
| 13 | 例外：`workflow_dispatch` 由 `GITHUB_TOKEN` 觸發仍會建立執行 | 觸發 | 2026-11-03：dispatch API 回 `204`，產生 `workflow_dispatch` 執行，actor=`github-actions[bot]` | 一致 |
