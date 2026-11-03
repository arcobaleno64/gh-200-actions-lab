# 實驗清單

每個實驗標明對應的學習站目標。步驟只用公開 repository 與 GitHub 代管的 runner。

## 總表

| # | 實驗 | 對應目標 | 狀態 |
| - | ---- | -------- | ---- |
| 1 | 功能分支的 `schedule` 與 `workflow_dispatch` | D1-O1 | 已寫 |
| 2 | 各事件的 `GITHUB_SHA` 與 `GITHUB_REF` | D1-O1 | 已跑（2026-11-03） |
| 3 | boolean input：`inputs` 與 `github.event.inputs` | D1-O1 | 已跑（2026-11-03） |
| 4 | 矩陣的 `include`、`exclude`、`fail-fast` | D1-O2 | 已跑（2026-11-03） |
| 5 | 服務容器：容器內與 runner 上的連線 | D1-O2 | 已跑（2026-11-03） |
| 6 | `outcome` 與 `conclusion`；`if` 內的 context | D1-O2 | 已跑（2026-11-03） |
| 7 | 快取的分支隔離與 `restore-keys` 順序 | D1-O3 | 已跑（2026-11-03） |
| 8 | 成品：同名上傳、跨執行下載、REST 302 網址 | D1-O3、D2-O2 | 已跑（2026-11-03） |
| 9 | 重新執行與除錯記錄 | D2-O1 | 已跑（2026-11-03） |
| 10 | 可重用工作流程與複合 action | D2-O3、D3-O1 | 已跑（2026-11-03） |
| 11 | 三種自訂 action | D3-O1、D3-O2 | 已跑（2026-11-03） |
| 12 | script injection 與環境變數防範 | D5-O1 | 已跑（2026-11-03） |
| 13 | `GITHUB_TOKEN` 權限與觸發規則 | D5-O1 | 待寫 |
| 14 | OIDC：只檢視 claims，不連雲端 | D5-O1 | 待寫 |

## 實驗 1：功能分支的 schedule 與 workflow_dispatch

**學習站的說法：** `schedule` 與 `workflow_dispatch` 只在預設分支的工作流程檔上觸發。

**步驟：**
1. 從 `main` 建立分支 `lab01-schedule`。
2. 把 `labs/01-schedule.yml` 複製到 `.github/workflows/lab01-schedule.yml` 並推送該分支。
3. 到 Actions 頁籤：等 15 分鐘，看有沒有執行；看左側清單有沒有這個工作流程。
4. 把分支合併到 `main`，再等下一個 5 分鐘的整點附近，看有沒有排程執行。
5. 開啟任何一次排程執行，記下它的 `GITHUB_SHA`（預期是 `main` 的最後一個 commit）。

**預期：** 步驟 3 沒有任何執行，也不能手動觸發；步驟 4 之後才開始排程（可能延遲，高負載時尤其明顯）。
**驗證方式：** 截圖或貼上 Actions 頁面的執行列表，並記錄延遲多久。
**記得清理：** 做完把 cron 改成每日一次或刪除檔案，避免持續執行。

## 實驗 2：各事件的 GITHUB_SHA 與 GITHUB_REF

**學習站的說法：** `pull_request` 的 `GITHUB_SHA` 是 PR 合併 commit，`GITHUB_REF` 是 `refs/pull/編號/merge`；`push` 是推送的最新 commit；`workflow_dispatch` 是收到 dispatch 的分支最後 commit。

**步驟：**
1. `.github/workflows/lab02-sha-ref.yml` 已經在 `main`。
2. 在 `main` 手動執行一次（Run workflow），記下輸出。
3. 建分支 `lab02/a`，加一個 commit 並推送，記下 `push` 的輸出。
4. 開 PR（`lab02/a` → `main`），記下 `pull_request` 的輸出，並與 PR 頁面上的 head commit 比較。

**預期：** `pull_request` 的 `GITHUB_SHA` 不等於 PR 分支尖端 commit。
**驗證方式：** 把三組輸出貼進 `OBSERVATIONS.md`。

## 實驗 3：boolean input 的型別

**學習站的說法：** `inputs` context 保留 boolean 型別；`github.event.inputs` 會把 boolean 轉成字串。

**步驟：**
1. `.github/workflows/lab03-inputs.yml` 已經在 `main`。
2. 在 Actions 手動執行，`dry_run` 勾選（true）一次、不勾選（false）一次。
3. 記下哪些步驟有執行、哪些被略過，以及最後一步印出的原始字串。

**預期：** `dry_run` 為 true 時，步驟 a 與 b 會執行，步驟 c（與布林值 true 比較）不會；為 false 時，a 不執行，b 也不執行。
**驗證方式：** 把兩次執行的步驟狀態貼進 `OBSERVATIONS.md`。

## 實驗 4：矩陣的 include、exclude 與 fail-fast

**學習站的說法：** `include` 與 `exclude` 修改組合；`fail-fast` 啟用時一個組合失敗會取消其他組合。**未核對：** 沒設定 `fail-fast` 時的預設行為、矩陣 job 的顯示名稱。

**步驟：**
1. `.github/workflows/lab04-matrix.yml` 已在 `main`，在 Actions 手動執行。
2. 看 `default-failfast`（沒設 `fail-fast`，id 1 會失敗，其他 sleep 45 秒）：其他組合是被取消還是完成。
3. 看 `failfast-false`（同樣的形狀，但 `fail-fast: false`）。
4. 看 `count`：2×2 矩陣、`exclude` 一組、`include` 一組新的 macOS，共產生幾個 job，名稱怎麼顯示。
5. 用 `gh api repos/<擁有者>/<repo>/actions/runs/<run_id>/jobs --jq '.jobs[]|[.name,.conclusion]|@tsv'` 取得每個 job 的名稱與結果。

**預期：** `default-failfast` 的其他組合被取消；`failfast-false` 的其他組合完成；`count` 是 4 個 job。
**驗證方式：** 把 job 名稱與結果貼進 `OBSERVATIONS.md`。

## 實驗 5：服務容器的連線

**學習站的說法：** job 在容器內時用服務標籤當主機名稱，不必設定 `ports`；job 直接在 runner 上時用 `localhost` 並要對應 `ports`。**未核對：** `options` 的 `--health-cmd`。

**步驟：**
1. `.github/workflows/lab05-services.yml` 已在 `main`，在 Actions 手動執行。
2. 三個 job 各用 bash 的 `/dev/tcp` 對 `localhost:6379` 與 `redis:6379` 送 `PING`（不需要 redis-cli）：`on-runner-ports`（直接在 runner、有 `ports`、帶 `--health-cmd`）、`on-runner-noports`（直接在 runner、沒有 `ports`）、`in-container`（job 在 `ubuntu:22.04` 容器內、沒有 `ports`）。
3. 看日誌中的 `PROBE` 行，以及 `Initialize containers` 的健康檢查訊息。

**預期：** 只有 `localhost` 與 `ports` 的組合、以及容器內用標籤的組合會回 `+PONG`。
**驗證方式：** 把六個探測結果貼進 `OBSERVATIONS.md`。
**踩到的坑：** 探測函式在 `bash -e` 下，失敗的指令替換會讓整個步驟中止，要用 `|| rc=$?` 接住；容器內預設 shell 是 `sh`，要明確指定 `shell: bash` 才有 `/dev/tcp`。

## 實驗 6：outcome 與 conclusion；if 內的 context

**學習站的說法：** `outcome` 是套用 `continue-on-error` 之前的結果，`conclusion` 是之後的結果；`secrets` 與 `matrix` 不能用在 `jobs.<id>.if`，`secrets` 也不能用在 `steps.if`。

**步驟：**
1. `.github/workflows/lab06-outcome.yml` 已在 `main`：`lint` 步驟失敗但設了 `continue-on-error: true`，後面三個步驟分別用 `outcome == 'failure'`、`conclusion == 'failure'`、`conclusion == 'success'` 判斷；另有 job 層級 `env` 放 `${{ secrets.LAB06_NOT_SET != '' }}`（secret 刻意不設）。手動執行並看各步驟狀態。
2. 建分支 `lab06/invalid`，把 `labs/06-invalid-*.yml` 三個檔案複製到 `.github/workflows/` 並推送，各自會因 push 觸發一次。
3. 開各次執行頁面，看頁面上的 Annotations 訊息（API 取不到，要從網頁看）。

**預期：** 步驟 `outcome == 'failure'` 與 `conclusion == 'success'` 執行，`conclusion == 'failure'` 略過；三個無效檔案都在解析時被拒絕。
**驗證方式：** 貼上步驟狀態與三則錯誤訊息。
**踩到的坑：** 我第一版 `lab06-outcome.yml` 本身就無效：`run: echo "ran: outcome is failure"` 在純量中含 `: `，YAML 解析失敗，頁面只顯示 `You have an error in your yaml syntax on line 26`；改成不含冒號的字串後才通過。

## 實驗 7：快取的分支隔離與 restore-keys 順序

**學習站的說法：** 一次執行可以還原目前分支與預設分支的快取，子分支與兄弟分支拿不到；查找順序是完全相同的 key、key 的前綴、`restore-keys` 依列出順序，同一個 restore key 符合多個時用最近建立的。

**步驟：**
1. `.github/workflows/lab07-cache.yml` 已在 `main`：用 `workflow_dispatch` 的輸入決定要還原的 `key`、`restore_keys`，以及（選填）要儲存的 `save_key` 與內容；日誌印出 `RESULT ... cache-hit ... matched ... content`。
2. 在 `main` 依序存入 `lab07-main-1`、`lab07-p-1`、`lab07-p-2`、`lab07-q-1`（內容分別是 main、p1、p2、q1）。
3. 建分支 `lab07/b1`、`lab07/b2`；用 `gh workflow run lab07-cache.yml --ref <分支> -f key=... -f restore_keys=...` 在各分支探測，並在 b1 存入 `lab07-b1-1`。
4. 在 `main` 探測各種 key 與 `restore-keys` 組合。
5. 做完刪除兩個分支；快取會依保留期自動清掉，也可用 `gh cache delete` 清除。

**預期：** 分支能還原預設分支的快取，看不到兄弟或子分支的；順序如學習站所述。
**驗證方式：** 貼上每次探測的 `RESULT` 行。
**踩到的坑：** `-f restore_keys` 要用 bash 的 `$'a
b'` 才能傳多行；擷取日誌時要避開 workflow 原始碼裡那行 `echo "RESULT ..."`，否則會抓到未展開的變數名稱。

## 實驗 8：成品的不可變、跨執行下載與 REST 302 網址

**學習站的說法：** v4 成品不可變，同名不能再上傳；上傳回傳 `digest` 且下載端比對；`download-artifact` 預設只能取同一次執行的成品，跨執行要提供 token 與執行編號；REST 下載回 302，`archive_format` 必須是 `zip`，網址只有 1 分鐘有效；刪除執行會連同成品一起刪除。

**步驟：**
1. `.github/workflows/lab08-artifacts.yml` 已在 `main`。手動執行一次（不填輸入）：同一次執行上傳 `build` 兩次（第二次設 `continue-on-error`），再用 `download-same-run` 下載。
2. 以第一次的 run id 當 `run_id` 再執行兩次，`with_token` 分別為 true 與 false，看 `download-cross-run` 是否成功。
3. 用 `gh api repos/<擁有者>/<repo>/actions/runs/<run_id>/artifacts` 看 `expires_at` 與 `digest`；用 `curl -D` 帶 token 呼叫 `.../actions/artifacts/<id>/zip`，看 302 與 `Location`，立刻與 75 秒後各 GET 一次，並解析網址中的 `se=`（到期時間，不要貼出簽章）。
4. 呼叫 `.../<id>/tar`；刪除一次執行（`DELETE .../actions/runs/<run_id>`）後再列出成品。

**預期：** 同名第二次上傳失敗；同一次執行可下載；跨執行成功；302 網址約 1 分鐘後失效；`tar` 失敗；刪除執行後成品消失。
**驗證方式：** 貼上各步驟輸出。
**踩到的坑：** `with_token=false` 時我傳空字串給 `github-token`，實際上動作改用預設的 `github.token`，所以沒有測到「完全沒有 token」；這一項不能下結論。

## 實驗 9：重新執行與除錯記錄

**學習站的說法：** 重跑沿用原本的 `GITHUB_SHA` 與 `GITHUB_REF`；只重跑失敗的 job 時，封存檔只含重跑的 job；重新執行時勾選 Enable debug logging（CLI `--debug`）會啟用 runner 診斷與步驟除錯；`ACTIONS_STEP_DEBUG` 同時是 secret 與 variable 時 secret 優先。

**步驟：**
1. `.github/workflows/lab09-rerun.yml` 已在 `main`：`check` job 在第 1 次嘗試故意失敗並印出 `RESULT9`（含 `GITHUB_SHA`、checkout 後的 HEAD、遠端 main 的 HEAD、`run_attempt`），`ok` job 永遠成功。手動執行一次。
2. 在 `main` 推一個新 commit，然後 `gh run rerun <id> --failed`（第 2 次嘗試）。
3. `gh run rerun <id> --debug`（第 3 次嘗試，全部 job）。用 `GET /repos/<擁有者>/<repo>/actions/runs/<id>/attempts/<n>/logs` 下載各次嘗試的封存檔，列出檔名並數 `##[debug]` 行。
4. 新增 repository variable `ACTIONS_STEP_DEBUG=true` 後重跑；再新增同名 secret（值 `false`）重跑；再刪除 variable 重跑。最後刪除 secret 與 variable。

**預期：** 第 2 次嘗試的 `GITHUB_SHA` 仍是第 1 次的；第 2 次封存檔只含 `check`；第 3 次出現 `##[debug]` 行與 `runner-diagnostic-logs`；variable 為 true 時有除錯行，secret 為 false 時沒有。
**驗證方式：** 貼上各次嘗試的 `RESULT9`、封存檔檔名與除錯行數。
**踩到的坑：** Windows 上的 python 讀不到 git bash 的 `/tmp` 路徑，檔案要放在 Windows 路徑下。

## 實驗 10：可重用工作流程與複合 action

**學習站的說法：** 呼叫端用 `uses` 加 `with`、`secrets`（或 `secrets: inherit`）；被呼叫端的 secret 必須在 `workflow_call.secrets` 宣告才能由呼叫端明確傳入；輸出要在 `workflow_call.outputs` 對應 job 輸出；呼叫端 job 不能同時有 `steps`、`runs-on`；複合 action 不能直接讀 `secrets` 內容，只能透過 input 傳入。

**步驟：**
1. `.github/workflows/lab10-called.yml`（`workflow_call`，輸入 `greeting`，選填 secret `token`，輸出 `result`）、`lab10-caller.yml`（三種呼叫：明確傳 `token`、不傳 secret、`secrets: inherit`，另有 job 讀被呼叫端的輸出）、`.github/actions/lab10-composite` 與 `lab10-composite-direct` 已在 `main`。先在 repo 設 secret `LAB10_REPO_SECRET`（實驗後刪除），手動執行 `lab10-caller`。
2. 在分支 `lab10/invalid` 推四個故意無效的呼叫端檔案：`steps`、`environment`、`uses` 內含運算式、`runs-on` 與 `uses` 並存，看解析錯誤。實驗後刪除分支。

**預期：** 明確傳入才有 token；未宣告的 secret 在被呼叫端讀不到，除非 `secrets: inherit`；輸出可傳回；複合 action 直接讀 `secrets` 會失敗；四個無效檔案都在解析時被拒絕。
**驗證方式：** 貼上每個 job 的 `RESULT10` 行與四個無效檔案的註解訊息。
**踩到的坑：** 用 bash 的 here-doc 一次寫多個含引號的 YAML 容易因為引號配對失敗而整段不執行，改用 Write 工具逐檔寫入。

## 實驗 11：三種自訂 action

**學習站的說法：** Docker 容器 action 只能在 Linux runner 執行；JavaScript action 以 `INPUT_<名稱>` 環境變數收輸入；複合 action 的輸出要有 `value`；JavaScript／Docker 的輸出靠 `$GITHUB_OUTPUT`。

**步驟：**
1. `.github/actions/lab11-js`（`pre`／`main`／`post`，不依賴套件）、`lab11-docker`（alpine 加 `entrypoint.sh`，輸入用 `args` 傳入）、`lab11-composite-meta` 已在 `main`；`lab11-actions.yml` 在 ubuntu 與 windows 各跑一次，每個 action 都印出 `RESULT11` 行。
2. JS action 宣告一個 `required: true` 的輸入但呼叫端不傳，看是否報錯。

**預期：** Docker 在 Windows 失敗；JS 收到 `INPUT_*`；輸出可由後續步驟讀到；`post` 讀得到 `main` 存的狀態。
**驗證方式：** 貼上各 job 的 `RESULT11` 行與註解訊息。
**踩到的坑：** 我的複合 action 探測腳本用 `env | grep '^INPUT_'`，沒有符合時 `pipefail` 讓步驟失敗；那是腳本問題，不是 action 規則，加 `|| true` 後重跑。

## 實驗 12：script injection 與環境變數防範

**學習站的說法：** `run` 或 `github-script` 的內容中直接寫 `${{ ... }}`，運算式會先被展開成文字再交給 shell 或 JavaScript，惡意輸入可以變成指令；先放進 `env` 再用環境變數取值，值只是資料。附加到 `GITHUB_ENV` 的不受信任文字若含換行，可以多設一個環境變數。

**步驟：**
1. `.github/workflows/lab12-injection.yml` 已在 `main`，用 `workflow_dispatch` 輸入當成「不受信任的文字」（**只印出一行無害的標記，不做任何有破壞性的事**）。六個步驟：A 在 `run` 內直接寫運算式；B 經 `env`；C 在 `github-script` 的字串內直接寫運算式；D 經 `process.env`；E 把輸入附加到 `GITHUB_ENV`；E2 讀回。
2. 依序用四組輸入各跑一次：`Mona`（對照）；`x"; echo INJECTED-SHELL; echo "`（打斷 shell 的雙引號）；`x'); core.info('INJECTED-JS`（打斷 JavaScript 的單引號）；含換行的 `first` 與 `LAB12_INJECTED=yes`。

**預期：** A、C 在打斷引號時多執行一段；B、D 永遠只是字串；E 在含換行時多設一個變數。
**驗證方式：** 貼上每次的 `RESULT12` 行，與日誌中 `Run` 區塊顯示的展開後腳本。
**踩到的坑：** 我的第一版篩選條件把含 `echo "` 的輸出行也濾掉，看起來像少了結果；要改成逐步驟檢視。

## 實驗 13 到 14

尚未撰寫；規劃見總表。每個實驗寫完前先確認它能解決學習站章節裡哪個「尚未核對」的項目，再動手。
