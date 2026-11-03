# gh-200-actions-lab

GH-200（GitHub Actions）的實作練習 repo，對應姊妹專案 [gh-600-agentic-ai-study-guide](https://github.com/arcobaleno64/gh-600-agentic-ai-study-guide) 的 GH-200 學習內容（https://gh200.satenvision.com ）。

## 目的

學習站的內容是讀官方文件後整理的。這裡把其中「頁面這麼說」的句子拿到真實的 repository 上執行一次，記錄實際行為，找出文件與實際不一致的地方，並解決學習站章節裡標為「尚未核對」的項目。

## 為什麼是公開 repository

公開 repository 可以免費使用 GitHub 代管的 runner、快取與成品。需要組織或企業層級的功能（Actions 政策、runner 群組、larger runners、自管 runner 的更新與排隊、組織範本）**不在本 repo 範圍內**。

## 結構

| 路徑 | 內容 |
| ---- | ---- |
| `LABS.md` | 14 個實驗：步驟、預期觀察、驗證方式（目前寫了 1 到 3） |
| `OBSERVATIONS.md` | 實測紀錄表：學習站的說法 vs 實際觀察 |
| `.github/workflows/` | 練習用、會在預設分支執行的 workflow |
| `labs/` | 需要放在特定分支才有意義的 workflow 範本，照 `LABS.md` 複製使用 |

## 安全規則

1. **永遠不要放入真實的憑證或雲端帳號。** 需要 secret 的實驗只用自己隨手編的測試字串。
2. **不要在自己的機器上架自管 runner**；公開 repository 加自管 runner 本身就是學習站領域五要教的風險。
3. 測試 script injection 時，只在自己的練習 repository 用無害的字串，不要讓別人的貢獻觸發它。
4. 練習完成後可以停用工作流程，或直接封存這個 repository。

## 記錄方式

每個實驗先在 `OBSERVATIONS.md` 寫下「學習站的說法」與你的預期，再執行，最後填入實際看到的日誌或畫面，並標記是否一致。不一致的項目回頭修正學習站章節。
