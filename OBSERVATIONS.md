# 實測紀錄

| 實驗 | 學習站的說法 | 預期 | 實際觀察 | 一致？ |
| ---- | ------------ | ---- | -------- | ------ |
| 1 | schedule 與 workflow_dispatch 只在預設分支的檔案上觸發 | 功能分支沒有執行、不能手動觸發 | （待填） | |
| 1 | 排程的 GITHUB_SHA 是預設分支的最後 commit | 等於 main 的最新 commit | （待填） | |
| 2 | pull_request 的 GITHUB_SHA 是 PR 合併 commit | 不等於 PR 分支尖端 commit | 2026-11-03：GITHUB_SHA=2eccd195…，GITHUB_REF=refs/pull/1/merge；PR 分支尖端（head.sha）是 0444fc0d…；2eccd195 等於 refs/pull/1/merge 所指的 commit | 一致 |
| 2 | push 的 GITHUB_SHA 是推送的最新 commit | 等於該分支尖端 commit | 2026-11-03：push 到 lab02/a，GITHUB_SHA=0444fc0d…（分支尖端），GITHUB_REF=refs/heads/lab02/a；在 main 以 workflow_dispatch 執行時 SHA=bb2abd8a…、REF=refs/heads/main | 一致 |
| 3 | github.event.inputs 把 boolean 轉成字串 | 與 true 比較的步驟不執行 | 2026-11-03：dry_run=true 時 raw=true，步驟 b（== 'true'）執行、步驟 c（== true）略過；dry_run=false 時 b 與 c 都略過 | 一致 |
| 3 | inputs 保留 boolean 型別 | `if: inputs.dry_run` 在 true 時執行 | 2026-11-03：dry_run=true 時步驟 a 執行；dry_run=false 時 a 略過 | 一致 |
