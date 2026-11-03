# 實測紀錄

| 實驗 | 學習站的說法 | 預期 | 實際觀察 | 一致？ |
| ---- | ------------ | ---- | -------- | ------ |
| 1 | schedule 與 workflow_dispatch 只在預設分支的檔案上觸發 | 功能分支沒有執行、不能手動觸發 | （待填） | |
| 1 | 排程的 GITHUB_SHA 是預設分支的最後 commit | 等於 main 的最新 commit | （待填） | |
| 2 | pull_request 的 GITHUB_SHA 是 PR 合併 commit | 不等於 PR 分支尖端 commit | （待填） | |
| 2 | push 的 GITHUB_SHA 是推送的最新 commit | 等於該分支尖端 commit | （待填） | |
| 3 | github.event.inputs 把 boolean 轉成字串 | 與 true 比較的步驟不執行 | （待填） | |
| 3 | inputs 保留 boolean 型別 | `if: inputs.dry_run` 在 true 時執行 | （待填） | |
