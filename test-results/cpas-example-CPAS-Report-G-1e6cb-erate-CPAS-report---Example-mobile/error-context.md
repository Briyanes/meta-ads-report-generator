# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cpas-example.spec.ts >> CPAS Report Generation >> Generate CPAS report - Example
- Location: app/e2e/cpas-example.spec.ts:11:7

# Error details

```
Test timeout of 180000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - link "Navigate back to home page" [ref=e5] [cursor=pointer]:
          - /url: /home
          - generic [ref=e6]:
            - heading "Meta Ads Report Generator" [level=1] [ref=e7]
            - paragraph [ref=e8]: Powered by Hadona Digital Media•v2.0.0
        - link "Hadona Digital Media" [ref=e10] [cursor=pointer]:
          - /url: https://hadona.id
          - img "Hadona Digital Media" [ref=e11]
    - main [ref=e13]:
      - generic [ref=e14]:
        - generic [ref=e16]:
          - generic [ref=e17]:
            - generic [ref=e18]: Nama Report (Opsional)
            - textbox "Weekly Report - Week 1" [ref=e19]
          - generic [ref=e20]:
            - generic [ref=e21]: Pemilihan Retensi
            - combobox "Select retention comparison type" [ref=e22] [cursor=pointer]:
              - option "WoW (Week-on-Week)" [selected]
              - option "MoM (Month-on-Month)"
          - generic [ref=e23]:
            - generic [ref=e24]: Pemilihan Iklan Objective
            - generic [ref=e25]:
              - radio "Click to WhatsApp objective" [checked] [ref=e26] [cursor=pointer]:
                - generic [ref=e28]: 
                - generic [ref=e29]:
                  - generic [ref=e31]: 
                  - generic [ref=e32]:
                    - paragraph [ref=e33]: CTWA
                    - paragraph [ref=e34]: Click to WhatsApp
                - paragraph [ref=e35]: Optimize for WhatsApp conversations
              - radio "Collaborative Ads with creators objective" [ref=e36] [cursor=pointer]:
                - generic [ref=e37]:
                  - generic [ref=e39]: 
                  - generic [ref=e40]:
                    - paragraph [ref=e41]: CPAS
                    - paragraph [ref=e42]: Collab Ads
                - paragraph [ref=e43]: Collaborative advertising with creators
              - radio "Click to Link to WhatsApp objective" [ref=e44] [cursor=pointer]:
                - generic [ref=e45]:
                  - generic [ref=e47]: 
                  - generic [ref=e48]:
                    - paragraph [ref=e49]: CTLP to WA
                    - paragraph [ref=e50]: Click Link to WhatsApp
                - paragraph [ref=e51]: Link clicks to WhatsApp conversations
              - radio "Click to Link to Purchase objective" [ref=e52] [cursor=pointer]:
                - generic [ref=e53]:
                  - generic [ref=e55]: 
                  - generic [ref=e56]:
                    - paragraph [ref=e57]: CTLP to Purchase
                    - paragraph [ref=e58]: Click Link to Purchase
                - paragraph [ref=e59]: Link clicks to website purchases
        - generic [ref=e61]:
          - heading " Metrics for CTWA" [level=2] [ref=e62]:
            - generic [ref=e63]: 
            - text: Metrics for CTWA
          - button " Read More" [ref=e64] [cursor=pointer]:
            - generic [ref=e65]: 
            - text: Read More
        - generic [ref=e66]:
          - 'heading "Upload CSV Files untuk: Week-on-Week Analysis" [level=2] [ref=e67]':
            - text: "Upload CSV Files untuk:"
            - text: Week-on-Week Analysis
          - paragraph [ref=e68]: Upload file utama + file breakdown (age, gender, region, platform, placement, objective, ad-creative)
          - generic [ref=e69]:
            - generic [ref=e70]:
              - generic [ref=e71]:
                - generic [ref=e72]: 
                - text: Minggu Ini (This Week) - 0 file(s)
              - generic [ref=e73] [cursor=pointer]:
                - generic [ref=e74]:
                  - paragraph [ref=e75]:
                    - generic [ref=e76]: 
                    - text: Drag & Drop atau click untuk upload
                  - paragraph [ref=e77]: CSV files (bisa multiple)
                - generic:
                  - generic:
                    - generic: 
            - generic [ref=e78]:
              - generic [ref=e79]:
                - generic [ref=e80]: 
                - text: Minggu Lalu (Last Week) - 0 file(s)
              - generic [ref=e81] [cursor=pointer]:
                - generic [ref=e82]:
                  - paragraph [ref=e83]:
                    - generic [ref=e84]: 
                    - text: Drag & Drop atau click untuk upload
                  - paragraph [ref=e85]: CSV files (bisa multiple)
                - generic:
                  - generic:
                    - generic: 
        - generic [ref=e86]:
          - button " Back to Home" [ref=e87] [cursor=pointer]:
            - generic [ref=e88]: 
            - text: Back to Home
          - button "Analyze uploaded CSV files" [disabled] [ref=e90]:
            - generic [ref=e91]: 
            - text: 1. Analyze CSV
        - generic [ref=e93]:
          - paragraph [ref=e94]:
            - generic [ref=e95]: © 2025 Ads Report Generator. Powered by
            - generic [ref=e96]: Hadona Digital Media
          - paragraph [ref=e97]: Designed & Developed by Briyanes
    - status [ref=e98]
  - alert [ref=e99]
```