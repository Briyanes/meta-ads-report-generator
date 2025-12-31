const CPAS_TEMPLATE = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CPAS Report - {REPORT_NAME}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        :root {
            --primary-blue: #2B46BB;
            --primary-yellow: #ECDC43;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: #f8fafc;
        }
        .slide {
            min-height: 900px;
            background: white;
            padding: 48px;
            page-break-inside: avoid;
        }
        .card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
        }
        .metric-value {
            font-size: 36px;
            font-weight: 700;
            color: var(--primary-blue);
            margin: 8px 0;
        }
        .metric-label {
            font-size: 12px;
            color: #64748b;
            font-weight: 500;
        }
        .growth-positive { color: #10B981; }
        .growth-negative { color: #EF4444; }
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 12px;
            overflow: hidden;
        }
        th {
            background: var(--primary-blue);
            color: white;
            padding: 16px;
            text-align: left;
            font-weight: 600;
        }
        .text-right { text-align: right; }
        td {
            padding: 16px;
            border-bottom: 1px solid #e2e8f0;
        }
        .badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 12px;
        }
        .badge-green { background: #d1fae5; color: #065f46; }
        .badge-red { background: #fee2e2; color: #991b1b; }
    </style>
</head>
<body>
    <!-- SLIDE 1: WELCOME -->
    <div class="slide">
        <h1 style="font-size: 42px; margin-bottom: 16px; color: var(--primary-blue);">
            CPAS Performance Report
        </h1>
        <h2 style="font-size: 20px; color: #64748b;">
            {REPORT_NAME}
        </h2>
        <p style="margin-top: 24px; font-size: 14px; color: #94a3b8;">
            <strong>Periode:</strong> {PERIOD_LABEL}
        </p>
    </div>

    <!-- SLIDE 2: PERFORMANCE SUMMARY -->
    <div class="slide">
        <h1 style="font-size: 28px; margin-bottom: 24px; color: var(--primary-blue);">
            Performance Summary
        </h1>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
            <!-- This Month -->
            <div class="card">
                <div class="metric-label">{THIS_PERIOD_LABEL}</div>
                <div style="margin-top: 16px;">
                    <div class="metric-label">Amount Spent</div>
                    <div class="metric-value">{THIS_SPEND}</div>
                </div>
                <div style="margin-top: 16px;">
                    <div class="metric-label">Results (Add to Cart)</div>
                    <div class="metric-value">{THIS_ATC}</div>
                </div>
                <div style="margin-top: 16px;">
                    <div class="metric-label">Cost per Result</div>
                    <div class="metric-value">{THIS_CPR}</div>
                </div>
                <div style="margin-top: 16px;">
                    <span style="color: {GROWTH_COLOR}; font-weight: 600;">
                        Growth: {GROWTH_PERCENT}%
                    </span>
                </div>
            </div>

            <!-- Last Month -->
            <div class="card">
                <div class="metric-label">{LAST_PERIOD_LABEL}</div>
                <div style="margin-top: 16px;">
                    <div class="metric-label">Amount Spent</div>
                    <div class="metric-value">{LAST_SPEND}</div>
                </div>
                <div style="margin-top: 16px;">
                    <div class="metric-label">Results (Add to Cart)</div>
                    <div class="metric-value">{LAST_ATC}</div>
                </div>
                <div style="margin-top: 16px;">
                    <div class="metric-label">Cost per Result</div>
                    <div class="metric-value">{LAST_CPR}</div>
                </div>
            </div>
        </div>

        <div style="background: linear-gradient(135deg, #fef9c3 0%, #fef08a 100%); border-left: 4px solid var(--primary-yellow); padding: 20px; border-radius: 12px; margin-top: 32px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -10px; right: -10px; font-size: 60px; opacity: 0.1;">💡</div>
            <p style="font-size: 14px; color: #854d0e; line-height: 1.7; font-weight: 500; position: relative; z-index: 1; margin: 0;">
                <strong>Key Insight:</strong> {PERIOD_TYPE} ini menunjukkan performa yang {GROWTH_SENTIMENT} dengan {THIS_ATC} add to cart dan CPR {THIS_CPR}.
                Pertumbuhan spend sebesar {SPEND_GROWTH}% {SPEND_SENTIMENT} dengan hasil yang {PERFORMANCE_SENTIMENT}.
                {CONVERSION_SENTIMENT}
            </p>
        </div>
    </div>

    <!-- SLIDE 3: DETAILED METRICS -->
    <div class="slide">
        <h1 style="font-size: 28px; margin-bottom: 24px; color: var(--primary-blue);">
            Detailed Performance Metrics
        </h1>
        <h2 style="font-size: 16px; color: #64748b; margin-bottom: 32px;">
            Complete {PERIOD_TYPE} Comparison
        </h2>

        <div style="overflow-x: auto;">
            <table>
                <thead>
                    <tr>
                        <th>Metrik</th>
                        <th class="text-right">{LAST_PERIOD_LABEL}</th>
                        <th class="text-right">{THIS_PERIOD_LABEL}</th>
                        <th class="text-right">Trending Value</th>
                        <th class="text-right">Trending %</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Amount Spent (IDR)</strong></td>
                        <td class="text-right">{LAST_SPEND}</td>
                        <td class="text-right">{THIS_SPEND}</td>
                        <td class="text-right {SPEND_CLASS}">{SPEND_DIFF}</td>
                        <td class="text-right"><span class="badge {SPEND_BADGE_CLASS}">{SPEND_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Impressions</strong></td>
                        <td class="text-right">{LAST_IMPRESSIONS}</td>
                        <td class="text-right">{THIS_IMPRESSIONS}</td>
                        <td class="text-right {IMPR_CLASS}">{IMPR_DIFF}</td>
                        <td class="text-right"><span class="badge {IMPR_BADGE_CLASS}">{IMPR_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Link Clicks</strong></td>
                        <td class="text-right">{LAST_CLICKS}</td>
                        <td class="text-right">{THIS_CLICKS}</td>
                        <td class="text-right {CLICKS_CLASS}">{CLICKS_DIFF}</td>
                        <td class="text-right"><span class="badge {CLICKS_BADGE_CLASS}">{CLICKS_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Add to Cart</strong></td>
                        <td class="text-right">{LAST_ATC}</td>
                        <td class="text-right">{THIS_ATC}</td>
                        <td class="text-right {ATC_CLASS}">{ATC_DIFF}</td>
                        <td class="text-right"><span class="badge {ATC_BADGE_CLASS}">{ATC_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Purchases</strong></td>
                        <td class="text-right">{LAST_PURCHASES}</td>
                        <td class="text-right">{THIS_PURCHASES}</td>
                        <td class="text-right {PURCH_CLASS}">{PURCH_DIFF}</td>
                        <td class="text-right"><span class="badge {PURCH_BADGE_CLASS}">{PURCH_GROWTH}%</span></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background: linear-gradient(135deg, #fef9c3 0%, #fef08a 100%); border-left: 4px solid var(--primary-yellow); padding: 20px; border-radius: 12px; margin-top: 32px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -10px; right: -10px; font-size: 60px; opacity: 0.1;">💡</div>
            <p style="font-size: 14px; color: #854d0e; line-height: 1.7; font-weight: 500; position: relative; z-index: 1; margin: 0;">
                <strong>Insight Utama:</strong> Performa {PERIOD_TYPE} ini {METRIC_PERFORMANCE_DESC}.
                {TOP_PERFORMER_METRIC} adalah top performer dengan {TOP_PERFORMER_GROWTH}% pertumbuhan.
                {CTR_SENTIMENT} CTR sebesar {THIS_CTR}%.
                Rekomendasi: {METRICS_RECOMMENDATION}
            </p>
        </div>
    </div>

    <!-- SLIDE 4: KEY INSIGHTS -->
    <div class="slide">
        <h1 style="font-size: 28px; margin-bottom: 24px; color: var(--primary-blue);">
            Key Insights
        </h1>
        <h2 style="font-size: 16px; color: #64748b; margin-bottom: 32px;">
            Analysis & Recommendations
        </h2>

        <div style="background: linear-gradient(135deg, #fef9c3 0%, #fef08a 100%); border-left: 4px solid var(--primary-yellow); padding: 20px; border-radius: 12px; margin-bottom: 24px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -10px; right: -10px; font-size: 60px; opacity: 0.1;">💡</div>
            <h3 style="color: #92400e; margin-bottom: 12px; font-size: 18px; position: relative; z-index: 1;">
                Performance Overview
            </h3>
            <p style="color: #854d0e; line-height: 1.7; font-weight: 500; position: relative; z-index: 1; margin: 0;">
                Campaign performance {PERIOD_TYPE} ini menunjukkan tren {GROWTH_SENTIMENT} dengan kenaikan spend {SPEND_GROWTH}%.
                Cost per Result berada di angka {THIS_CPR}, menunjukkan efisiensi {EFFICIENCY_SENTIMENT}.
                {PERFORMANCE_HIGHLIGHT}
            </p>
        </div>

        <div style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); border-left: 4px solid #0ea5e9; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
            <h3 style="color: #075985; margin-bottom: 12px; font-size: 18px;">
                📈 Top Performers
            </h3>
            <ul style="color: #0c4a6e; line-height: 1.8; margin-left: 20px; font-weight: 500;">
                <li><strong>Add to Cart:</strong> {THIS_ATC} konversi dengan pertumbuhan {ATC_GROWTH}%</li>
                <li><strong>Impressions:</strong> {THIS_IMPRESSIONS} dengan peningkatan {IMPR_GROWTH}%</li>
                <li><strong>Purchases:</strong> {THIS_PURCHASES} transaksi tercatat</li>
            </ul>
        </div>

        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-left: 4px solid #16a34a; padding: 20px; border-radius: 12px;">
            <h3 style="color: #14532d; margin-bottom: 12px; font-size: 18px;">
                🎯 Rekomendasi Strategis
            </h3>
            <ul style="color: #14532d; line-height: 1.8; margin-left: 20px; font-weight: 500;">
                <li>{STRATEGY_RECOMMENDATION_1}</li>
                <li>{STRATEGY_RECOMMENDATION_2}</li>
                <li>{STRATEGY_RECOMMENDATION_3}</li>
                <li>{STRATEGY_RECOMMENDATION_4}</li>
            </ul>
        </div>
    </div>

    <!-- SLIDE 5: AUDIENCE - AGE BREAKDOWN -->
    <div class="slide">
        <h1 style="font-size: 28px; margin-bottom: 24px; color: var(--primary-blue);">
            Audience Performance - Age
        </h1>
        <h2 style="font-size: 16px; color: #64748b; margin-bottom: 32px;">
            Demographic Analysis by Age Group
        </h2>

        {AGE_BREAKDOWN_TABLE}

        <div style="background: linear-gradient(135deg, #fef9c3 0%, #fef08a 100%); border-left: 4px solid var(--primary-yellow); padding: 20px; border-radius: 12px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -10px; right: -10px; font-size: 60px; opacity: 0.1;">💡</div>
            <p style="font-size: 14px; color: #854d0e; line-height: 1.7; font-weight: 500; position: relative; z-index: 1; margin: 0;">
                <strong>Insight:</strong> Segment usia 25-54 tahun biasanya mendominasi konversi dengan {ATC_GROWTH}% pertumbuhan.
                Rekomendasi: Fokuskan 80% budget pada segmen usia produktif (25-44 tahun) untuk hasil maksimal.
                Age 35-44 sering menjadi top performer dengan CPR terbaik.
            </p>
        </div>
    </div>

    <!-- SLIDE 6: AUDIENCE - GENDER BREAKDOWN -->
    <div class="slide">
        <h1 style="font-size: 28px; margin-bottom: 24px; color: var(--primary-blue);">
            Audience Performance - Gender
        </h1>
        <h2 style="font-size: 16px; color: #64748b; margin-bottom: 32px;">
            Demographic Analysis by Gender
        </h2>

        {GENDER_BREAKDOWN_TABLE}

        <div style="background: linear-gradient(135deg, #fef9c3 0%, #fef08a 100%); border-left: 4px solid var(--primary-yellow); padding: 20px; border-radius: 12px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -10px; right: -10px; font-size: 60px; opacity: 0.1;">💡</div>
            <p style="font-size: 14px; color: #854d0e; line-height: 1.7; font-weight: 500; position: relative; z-index: 1; margin: 0;">
                <strong>Insight:</strong> Female biasanya mendominasi dengan ~70% share dari total konversi.
                Male memiliki CTR lebih rendah namun volume konversi tetap signifikan.
                Rekomendasi: Female adalah segmen prioritas untuk scaling campaign, pertahankan alokasi 70:30 Female:Male.
            </p>
        </div>
    </div>

    <!-- SLIDE 7: AUDIENCE - REGION BREAKDOWN -->
    <div class="slide">
        <h1 style="font-size: 28px; margin-bottom: 24px; color: var(--primary-blue);">
            Audience Performance - Region
        </h1>
        <h2 style="font-size: 16px; color: #64748b; margin-bottom: 32px;">
            Geographic Performance Analysis
        </h2>

        {REGION_BREAKDOWN_TABLE}

        <div style="background: linear-gradient(135deg, #fef9c3 0%, #fef08a 100%); border-left: 4px solid var(--primary-yellow); padding: 20px; border-radius: 12px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -10px; right: -10px; font-size: 60px; opacity: 0.1;">💡</div>
            <p style="font-size: 14px; color: #854d0e; line-height: 1.7; font-weight: 500; position: relative; z-index: 1; margin: 0;">
                <strong>Insight:</strong> Pulau Jawa (West, Central, East + Jakarta) biasanya menyumbang ~75-80% total konversi.
                West Java sering menjadi region dengan performa tertinggi.
                Rekomendasi: Scale di region Jawa dengan performa tinggi sebelum ekspansi ke region baru.
            </p>
        </div>
    </div>

    <!-- SLIDE 8: PLATFORM PERFORMANCE -->
    <div class="slide">
        <h1 style="font-size: 28px; margin-bottom: 24px; color: var(--primary-blue);">
            Platform Performance
        </h1>
        <h2 style="font-size: 16px; color: #64748b; margin-bottom: 32px;">
            Instagram vs Facebook Comparison
        </h2>

        {PLATFORM_BREAKDOWN_TABLE}

        <div style="background: linear-gradient(135deg, #fef9c3 0%, #fef08a 100%); border-left: 4px solid var(--primary-yellow); padding: 20px; border-radius: 12px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -10px; right: -10px; font-size: 60px; opacity: 0.1;">💡</div>
            <p style="font-size: 14px; color: #854d0e; line-height: 1.7; font-weight: 500; position: relative; z-index: 1; margin: 0;">
                <strong>Insight:</strong> Instagram biasanya mendominasi dengan ~65-70% share dari total konversi.
                Facebook memiliki CTR lebih tinggi namun volume lebih rendah.
                Rekomendasi: Pertahankan alokasi 60:40 atau 65:35 Instagram:Facebook untuk diversifikasi dan reach maksimal.
            </p>
        </div>
    </div>

    <!-- SLIDE 9: PLACEMENT PERFORMANCE -->
    <div class="slide">
        <h1 style="font-size: 28px; margin-bottom: 24px; color: var(--primary-blue);">
            Placement Performance
        </h1>
        <h2 style="font-size: 16px; color: #64748b; margin-bottom: 32px;">
            Ad Placement Analysis (Feed, Stories, Reels, Explore)
        </h2>

        {PLACEMENT_BREAKDOWN_TABLE}

        <div style="background: linear-gradient(135deg, #fef9c3 0%, #fef08a 100%); border-left: 4px solid var(--primary-yellow); padding: 20px; border-radius: 12px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -10px; right: -10px; font-size: 60px; opacity: 0.1;">💡</div>
            <p style="font-size: 14px; color: #854d0e; line-height: 1.7; font-weight: 500; position: relative; z-index: 1; margin: 0;">
                <strong>Insight:</strong> Reels (IG + FB) biasanya adalah placement terbaik dengan kombinasi volume tertinggi dan CPR paling efisien.
                Feed menawarkan CTR terbaik namun dengan volume lebih rendah.
                Stories sering underperform dengan CPR tinggi.
                Rekomendasi: Alokasikan 70% budget ke Reels, 25% ke Feed, dan 5% testing ke Stories.
            </p>
        </div>
    </div>

    <!-- SLIDE 10: CREATIVE PERFORMANCE -->
    <div class="slide">
        <h1 style="font-size: 28px; margin-bottom: 24px; color: var(--primary-blue);">
            Creative Performance
        </h1>
        <h2 style="font-size: 16px; color: #64748b; margin-bottom: 32px;">
            Top Performing Ad Creatives
        </h2>

        {CREATIVE_BREAKDOWN_TABLE}

        <div style="background: linear-gradient(135deg, #fef9c3 0%, #fef08a 100%); border-left: 4px solid var(--primary-yellow); padding: 20px; border-radius: 12px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -10px; right: -10px; font-size: 60px; opacity: 0.1;">💡</div>
            <p style="font-size: 14px; color: #854d0e; line-height: 1.7; font-weight: 500; position: relative; z-index: 1; margin: 0;">
                <strong>Insight:</strong> Collection Ads biasanya mendominasi top performing creatives dengan ~85-90% market share.
                Multi-product collections sering menjadi champion dengan volume konversi tertinggi.
                Rekomendasi: Scale up Collection Ads format, particularly multi-product collections. Pause single-product dan underperforming ads.
            </p>
        </div>
    </div>

    <!-- SLIDE 11: CONCLUSION -->
    <div class="slide">
        <h1 style="font-size: 28px; margin-bottom: 24px; color: var(--primary-blue);">
            Conclusion
        </h1>
        <h2 style="font-size: 16px; color: #64748b; margin-bottom: 32px;">
            Summary & Key Takeaways
        </h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-left: 4px solid #16a34a; padding: 24px; border-radius: 12px;">
                <h3 style="color: #14532d; margin-bottom: 16px; font-size: 18px;">
                    ✅ Wins
                </h3>
                <ul style="color: #14532d; line-height: 1.8; margin-left: 20px; font-weight: 500;">
                    <li>{THIS_ATC} Add to Cart conversions achieved</li>
                    <li>Pertumbuhan kuat {SPEND_GROWTH}% dalam spend</li>
                    <li>CPR terjaga di {THIS_CPR}</li>
                    <li>{CONVERSION_RATE_WIN}% conversion rate dari ATC</li>
                </ul>
            </div>

            <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-left: 4px solid #dc2626; padding: 24px; border-radius: 12px;">
                <h3 style="color: #7f1d1d; margin-bottom: 16px; font-size: 18px;">
                    ⚠️ Areas for Improvement
                </h3>
                <ul style="color: #7f1d1d; line-height: 1.8; margin-left: 20px; font-weight: 500;">
                    <li>Optimasi CTR untuk engagement lebih baik</li>
                    <li>Tingkatkan conversion rate dari ATC ke Purchase</li>
                    <li>Test format kreatif baru untuk variety</li>
                    <li>{IMPROVEMENT_AREA}</li>
                </ul>
            </div>
        </div>

        <div style="background: linear-gradient(135deg, #fef9c3 0%, #fef08a 100%); border-left: 4px solid var(--primary-yellow); padding: 20px; border-radius: 12px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -10px; right: -10px; font-size: 60px; opacity: 0.1;">💡</div>
            <p style="font-size: 14px; color: #854d0e; line-height: 1.7; font-weight: 500; position: relative; z-index: 1; margin: 0;">
                <strong>Kesimpulan:</strong> {PERIOD_TYPE} ini menunjukkan performa {GROWTH_SENTIMENT} dengan {THIS_ATC} konversi.
                Campaign ini berada di jalur yang {EFFICIENCY_SENTIMENT} dengan CPR {THIS_CPR}.
                Fokus utama bulan depan: {NEXT_PERIOD_FOCUS}
            </p>
        </div>
    </div>

    <!-- SLIDE 12: NEXT STEPS -->
    <div class="slide">
        <h1 style="font-size: 28px; margin-bottom: 24px; color: var(--primary-blue);">
            Next Steps
        </h1>
        <h2 style="font-size: 16px; color: #64748b; margin-bottom: 32px;">
            Action Plan for Upcoming Period
        </h2>

        <div style="background: #f8fafc; padding: 24px; border-radius: 12px;">
            <ol style="color: #1e293b; line-height: 2; margin-left: 20px; font-weight: 500;">
                <li style="margin-bottom: 12px;"><strong>Scale Winning Creatives:</strong> {ACTION_STEP_1}</li>
                <li style="margin-bottom: 12px;"><strong>Audience Optimization:</strong> {ACTION_STEP_2}</li>
                <li style="margin-bottom: 12px;"><strong>Placement Testing:</strong> {ACTION_STEP_3}</li>
                <li style="margin-bottom: 12px;"><strong>Bid Strategy Review:</strong> {ACTION_STEP_4}</li>
                <li style="margin-bottom: 12px;"><strong>Creative Refresh:</strong> {ACTION_STEP_5}</li>
                <li><strong>Budget Allocation:</strong> {ACTION_STEP_6}</li>
            </ol>
        </div>

        <div style="background: linear-gradient(135deg, #fef9c3 0%, #fef08a 100%); border-left: 4px solid var(--primary-yellow); padding: 20px; border-radius: 12px; margin-top: 24px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -10px; right: -10px; font-size: 60px; opacity: 0.1;">🎯</div>
            <p style="font-size: 14px; color: #854d0e; line-height: 1.7; font-weight: 500; position: relative; z-index: 1; margin: 0;">
                <strong>Target Bulan Depan:</strong> {NEXT_MONTH_TARGET}. Dengan implementasi action plan ini,
                kita menargetkan pertumbuhan {TARGET_GROWTH}% pada Add to Cart dan penurunan CPR menjadi {TARGET_CPR}.
            </p>
        </div>
    </div>

    <!-- SLIDE 13: THANK YOU -->
    <div class="slide" style="text-align: center; padding-top: 120px;">
        <h1 style="font-size: 48px; margin-bottom: 24px; color: var(--primary-blue);">
            Thank You!
        </h1>
        <p style="font-size: 20px; color: #64748b; margin-bottom: 48px;">
            We appreciate your trust in managing your Meta Ads campaigns
        </p>

        <div style="background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-yellow) 100%);
                    padding: 32px; border-radius: 16px; color: white; max-width: 600px; margin: 0 auto;">
            <p style="font-size: 18px; margin-bottom: 8px;">
                <strong>Questions or Feedback?</strong>
            </p>
            <p style="font-size: 14px; opacity: 0.9;">
                Contact us anytime for campaign consultation
            </p>
        </div>
    </div>

    <!-- End of slides -->
</body>
</html>`

/**
 * Generate CPAS Report using inline template
 * This works without external file dependencies
 */
export function generateReactTailwindReport(analysisData: any, reportName?: string, retentionType?: string, objectiveType?: string): string {
  console.log('[CPAS Template] Starting report generation (inline template)...')

  // Debug: Log full analysisData structure
  console.log('[CPAS Template] Full analysisData keys:', Object.keys(analysisData || {}))

  const { thisWeek, lastWeek, breakdown, config, performanceSummary } = analysisData
  console.log('[CPAS Template] Data extracted:', {
    hasThisWeek: !!thisWeek,
    hasLastWeek: !!lastWeek,
    hasPerformanceSummary: !!performanceSummary,
    thisWeek: thisWeek,
    lastWeek: lastWeek,
    performanceSummary: performanceSummary
  })

  // Try to get data from performanceSummary first (newer structure)
  let thisMonthData = performanceSummary?.thisWeek || thisWeek || {}
  let lastMonthData = performanceSummary?.lastWeek || lastWeek || {}

  console.log('[CPAS Template] Month data:', {
    thisMonth: thisMonthData,
    lastMonth: lastMonthData
  })

  // Extract basic data
  const thisMonthSpend = thisMonthData.amountSpent || thisMonthData.spend || 0
  const lastMonthSpend = lastMonthData.amountSpent || lastMonthData.spend || 0
  const thisMonthATC = thisMonthData.addToCart || thisMonthData.addsToCart || thisMonthData.results || 0
  const lastMonthATC = lastMonthData.addToCart || lastMonthData.addsToCart || lastMonthData.results || 0

  // Extract more data for detailed metrics
  const thisMonthImpressions = thisMonthData.impressions || thisMonthData.impression || 0
  const lastMonthImpressions = lastMonthData.impressions || lastMonthData.impression || 0
  const thisMonthClicks = thisMonthData.clicks || thisMonthData.linkClicks || 0
  const lastMonthClicks = lastMonthData.clicks || lastMonthData.linkClicks || 0
  const thisMonthCTR = thisMonthData.ctr || (thisMonthClicks > 0 && thisMonthImpressions > 0 ? (thisMonthClicks / thisMonthImpressions * 100) : 0)
  const lastMonthCTR = lastMonthData.ctr || (lastMonthClicks > 0 && lastMonthImpressions > 0 ? (lastMonthClicks / lastMonthImpressions * 100) : 0)
  const thisMonthPurchases = thisMonthData.purchases || 0
  const lastMonthPurchases = lastMonthData.purchases || 0

  console.log('[CPAS Template] All metrics extracted')

  // Format helpers - NO decimals for currency - MUST BE DECLARED FIRST
  const formatCurrency = (num: number) => {
    // Round to nearest integer before formatting
    const rounded = Math.round(num)
    return 'Rp ' + rounded.toLocaleString('id-ID')
  }
  const formatNumber = (num: number) => {
    // Round to nearest integer before formatting
    const rounded = Math.round(num)
    return rounded.toLocaleString('id-ID')
  }
  const formatPercent = (num: number) => num.toFixed(2)

  // Calculate growth
  const spendGrowth = lastMonthSpend > 0 ? ((thisMonthSpend - lastMonthSpend) / lastMonthSpend * 100) : 0
  const imprGrowth = lastMonthImpressions > 0 ? ((thisMonthImpressions - lastMonthImpressions) / lastMonthImpressions * 100) : 0
  const clicksGrowth = lastMonthClicks > 0 ? ((thisMonthClicks - lastMonthClicks) / lastMonthClicks * 100) : 0
  const atcGrowth = lastMonthATC > 0 ? ((thisMonthATC - lastMonthATC) / lastMonthATC * 100) : 0
  const purchGrowth = lastMonthPurchases > 0 ? ((thisMonthPurchases - lastMonthPurchases) / lastMonthPurchases * 100) : 0
  const cprThisMonth = thisMonthATC > 0 ? (thisMonthSpend / thisMonthATC) : 0
  const cprLastMonth = lastMonthATC > 0 ? (lastMonthSpend / lastMonthATC) : 0

  // Helper to determine badge class and growth text
  const getBadgeClass = (growth: number) => growth >= 0 ? 'badge-green' : 'badge-red'
  const getGrowthText = (growth: number) => (growth > 0 ? '+' : '') + formatPercent(growth)
  const getDiffText = (thisVal: number, lastVal: number) => (thisVal - lastVal) >= 0 ? '+' : '' + formatNumber(thisVal - lastVal)
  const getDiffClass = (thisVal: number, lastVal: number) => (thisVal - lastVal) >= 0 ? 'growth-positive' : 'growth-negative'

  // Parse helper
  const parseNum = (val: any) => {
    if (typeof val === 'number') return val
    if (!val) return 0
    const parsed = parseFloat(String(val).replace(/,/g, ''))
    return isNaN(parsed) ? 0 : parsed
  }

  // Extract breakdown data
  const breakdownThisWeek = (analysisData as any).breakdown?.thisWeek || {}
  const breakdownLastWeek = (analysisData as any).breakdown?.lastWeek || {}

  // Helper to generate breakdown HTML for a dimension
  const generateBreakdownTable = (breakdownData: any[], dimensionName: string, dimensionKey: string) => {
    if (!breakdownData || breakdownData.length === 0) {
      return `
        <div style="background: #f8fafc; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <p style="color: #64748b; font-size: 14px;">
            ${dimensionName} breakdown data will be displayed here when ${dimensionName.toLowerCase()} breakdown CSV is provided.
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 8px;">
            Upload ${dimensionName.toLowerCase()} breakdown file to see detailed performance.
          </p>
        </div>
      `
    }

    // Get top 5 by Amount Spent
    const top5 = breakdownData.slice(0, 5)

    let tableRows = top5.map((item: any, idx: number) => {
      const name = item[dimensionKey] || item.dimension || `Item ${idx + 1}`
      const spend = parseNum(item['Amount spent (IDR)'] || item.spend || 0)
      const impressions = parseNum(item['Impressions'] || item.impressions || 0)
      const clicks = parseNum(item['Outbound clicks'] || item.clicks || 0)
      const ctr = impressions > 0 ? (clicks / impressions * 100).toFixed(2) : '0.00'
      const atc = parseNum(item['Adds to cart with shared items'] || item.atc || item.results || 0)
      const cpr = atc > 0 ? (spend / atc) : 0

      return `
        <tr>
          <td><strong>${name}</strong></td>
          <td class="text-right">${formatNumber(impressions)}</td>
          <td class="text-right">${ctr}%</td>
          <td class="text-right">${formatNumber(atc)}</td>
          <td class="text-right">${formatCurrency(cpr)}</td>
          <td class="text-right">${formatCurrency(spend)}</td>
        </tr>
      `
    }).join('')

    return `
      <div style="overflow-x: auto; margin-bottom: 24px;">
        <table>
          <thead>
            <tr>
              <th>${dimensionName}</th>
              <th class="text-right">Impressions</th>
              <th class="text-right">CTR</th>
              <th class="text-right">Add to Cart</th>
              <th class="text-right">CPR</th>
              <th class="text-right">Amount Spent</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    `
  }

  // Generate breakdown tables for each dimension
  const ageBreakdownHTML = generateBreakdownTable(breakdownThisWeek.age || [], 'Age', 'Age')
  const genderBreakdownHTML = generateBreakdownTable(breakdownThisWeek.gender || [], 'Gender', 'Gender')
  const regionBreakdownHTML = generateBreakdownTable(breakdownThisWeek.region || [], 'Region', 'Region')
  const platformBreakdownHTML = generateBreakdownTable(breakdownThisWeek.platform || [], 'Platform', 'Platform')
  const placementBreakdownHTML = generateBreakdownTable(breakdownThisWeek.placement || [], 'Placement', 'Placement')
  const creativeBreakdownHTML = generateBreakdownTable(breakdownThisWeek['ad-creative'] || breakdownThisWeek.creative || [], 'Creative', 'Ad name')

  // Determine sentiment texts
  const growthSentiment = spendGrowth >= 0 ? 'positif' : 'menantang'
  const spendSentiment = spendGrowth >= 0 ? 'sebanding' : 'perlu evaluasi'
  const performanceSentiment = atcGrowth >= 0 ? 'menggembirakan' : 'perlu improvement'
  const efficiencySentiment = cprThisMonth < 5000 ? 'baik' : cprThisMonth < 10000 ? 'moderat' : 'perlu improvement'
  const conversionSentiment = thisMonthPurchases > 0 && thisMonthATC > 0
    ? `Conversion rate dari ATC ke Purchase adalah ${((thisMonthPurchases / thisMonthATC) * 100).toFixed(1)}%`
    : 'Perlu optimalisasi funnel konversi'

  // Determine metric performance description
  const metricPerformanceDesc = atcGrowth > 50 ? 'sangat impresif dengan pertumbuhan signifikan'
    : atcGrowth > 0 ? 'positif dengan tren kenaikan'
    : 'perlu evaluasi dan optimalisasi'

  // Find top performer
  const metrics = [
    { name: 'Impressions', growth: imprGrowth },
    { name: 'Link Clicks', growth: clicksGrowth },
    { name: 'Add to Cart', growth: atcGrowth },
    { name: 'Purchases', growth: purchGrowth }
  ]
  const topPerformer = metrics.reduce((prev, current) => (prev.growth > current.growth) ? prev : current)
  const topPerformerMetric = topPerformer.name
  const topPerformerGrowth = formatPercent(topPerformer.growth)

  const ctrSentiment = thisMonthCTR > 1.5 ? 'CTR yang sehat' : thisMonthCTR > 1.0 ? 'CTR yang moderat' : 'CTR yang perlu dioptimasi'
  const metricsRecommendation = thisMonthCTR < 1.5
    ? 'Optimasi creative dan copywriting untuk meningkatkan CTR di atas 1.5%'
    : 'Pertahankan performa dan scale winning ad sets'

  // Strategy recommendations based on performance
  const strategyRecommendation1 = atcGrowth < 0
    ? 'Evaluasi dan pause underperforming ads, realokasi budget ke winning ads'
    : 'Scale up winning ad sets dengan performa CPR terbaik'

  const strategyRecommendation2 = thisMonthCTR < 1.5
    ? 'Refresh creative assets dan testing copywriting baru untuk meningkatkan engagement'
    : 'Pertahankan high-performing creatives dan buat variation untuk scaling'

  const strategyRecommendation3 = thisMonthPurchases === 0
    ? 'Optimasi landing page dan checkout process untuk meningkatkan conversion rate'
    : 'Implement retargeting campaigns untuk users yang ATC tapi belum purchase'

  const strategyRecommendation4 = cprThisMonth > 10000
    ? 'Review targeting dan audience segmentation untuk menurunkan CPR'
    : 'Explore new audience segments untuk expand reach sambil mempertahankan efisiensi'

  // Performance highlights
  const performanceHighlight = atcGrowth > 100
    ? `Pertumbuhan konversi sangat impresif sebesar ${atcGrowth.toFixed(1)}% dari periode sebelumnya.`
    : atcGrowth > 0
      ? `Tren positif dengan kenaikan ${atcGrowth.toFixed(1)}% pada konversi.`
      : 'Perlu strategi baru untuk meningkatkan performa konversi.'

  // Conversion rate calculation
  const conversionRateWin = thisMonthATC > 0 && thisMonthPurchases > 0
    ? ((thisMonthPurchases / thisMonthATC) * 100).toFixed(1)
    : '0.0'

  const improvementArea = thisMonthCTR < 1.5
    ? 'CTR perlu ditingkatkan di atas 1.5% untuk efficiency lebih baik'
    : cprThisMonth > 10000
      ? 'CPR perlu ditekan di bawah Rp 10.000 untuk profitability'
      : 'Explore new placements dan platforms untuk scaling'

  const nextPeriodFocus = atcGrowth < 0
    ? 'mengembalikan performa konversi ke level positif'
    : 'scaling winning campaigns sambil mempertahankan efisiensi'

  // Action steps
  const actionStep1 = atcGrowth > 0
    ? `Increase budget 20-30% untuk top-performing ads dengan CPR di bawah ${formatCurrency(cprThisMonth * 1.2)}`
    : 'Identify dan pause underperforming ads, realokasi budget ke potential winners'

  const actionStep2 = thisMonthCTR < 1.5
    ? 'Refine targeting dengan exclude non-converters dan focus pada high-intent audiences'
    : 'Expand audience reach dengan lookalike audiences berdasarkan top converters'

  const actionStep3 = cprThisMonth < 5000
    ? 'Scale ke Reels dan Explore placement dengan budget allocation 70:25:5 (Reels:Feed:Stories)'
    : 'Test new creative formats dan placements untuk menemukan combination CPR terbaik'

  const actionStep4 = thisMonthPurchases === 0
    ? 'Switch ke lowest cost bidding atau cost cap dengan target CPA Rp 10.000'
    : 'Implement bid strategy berdasarkan stage funnel: cost cap untuk ATC, lowest cost untuk purchase'

  const actionStep5 = atcGrowth < 0
    ? 'Refresh 100% creative assets dengan new concepts, angles, dan formats'
    : 'Launch 3-5 new creative variations per week untuk prevent ad fatigue'

  const actionStep6 = spendGrowth > 50
    ? 'Maintain current budget allocation dengan focus 80% pada top 30% performing ad sets'
    : 'Increase total budget 20-30% dengan prioritaskan pada channels dengan CPR terbaik'

  // Next month targets
  const nextMonthTarget = atcGrowth > 0
    ? `Scale campaigns untuk mencapai ${formatNumber(thisMonthATC * 1.5)} Add to Cart`
    : `Mencapai minimal ${formatNumber(thisMonthATC * 1.2)} Add to Cart dengan optimalisasi`

  const targetGrowth = 20
  const targetCPR = cprThisMonth > 5000 ? formatCurrency(cprThisMonth * 0.8) : formatCurrency(cprThisMonth)

  // Period labels
  const isWeek = retentionType === 'week'
  const thisPeriodLabel = isWeek ? 'Minggu Ini' : 'Bulan Ini'
  const lastPeriodLabel = isWeek ? 'Minggu Lalu' : 'Bulan Lalu'

  // Replace placeholders
  let html = CPAS_TEMPLATE
    // Slide 1 & 2
    .replace(/{REPORT_NAME}/g, reportName || 'CPAS Report')
    .replace(/{PERIOD_LABEL}/g, `${thisPeriodLabel} vs ${lastPeriodLabel}`)
    .replace(/{THIS_PERIOD_LABEL}/g, thisPeriodLabel)
    .replace(/{LAST_PERIOD_LABEL}/g, lastPeriodLabel)
    .replace(/{PERIOD_TYPE}/g, isWeek ? 'Weekly' : 'Monthly')
    .replace(/{THIS_SPEND}/g, formatCurrency(thisMonthSpend))
    .replace(/{LAST_SPEND}/g, formatCurrency(lastMonthSpend))
    .replace(/{THIS_ATC}/g, formatNumber(thisMonthATC))
    .replace(/{LAST_ATC}/g, formatNumber(lastMonthATC))
    .replace(/{THIS_CPR}/g, formatCurrency(cprThisMonth))
    .replace(/{LAST_CPR}/g, cprLastMonth > 0 ? formatCurrency(cprLastMonth) : '-')
    .replace(/{GROWTH_COLOR}/g, spendGrowth >= 0 ? '#10B981' : '#EF4444')
    .replace(/{GROWTH_PERCENT}/g, getGrowthText(spendGrowth))
    // Slide 3 - Detailed Metrics
    .replace(/{THIS_IMPRESSIONS}/g, formatNumber(thisMonthImpressions))
    .replace(/{LAST_IMPRESSIONS}/g, formatNumber(lastMonthImpressions))
    .replace(/{THIS_CLICKS}/g, formatNumber(thisMonthClicks))
    .replace(/{LAST_CLICKS}/g, formatNumber(lastMonthClicks))
    .replace(/{THIS_PURCHASES}/g, formatNumber(thisMonthPurchases))
    .replace(/{LAST_PURCHASES}/g, formatNumber(lastMonthPurchases))
    .replace(/{SPEND_DIFF}/g, getDiffText(thisMonthSpend, lastMonthSpend))
    .replace(/{SPEND_CLASS}/g, getDiffClass(thisMonthSpend, lastMonthSpend))
    .replace(/{SPEND_BADGE_CLASS}/g, getBadgeClass(spendGrowth))
    .replace(/{SPEND_GROWTH}/g, getGrowthText(spendGrowth))
    .replace(/{IMPR_DIFF}/g, getDiffText(thisMonthImpressions, lastMonthImpressions))
    .replace(/{IMPR_CLASS}/g, getDiffClass(thisMonthImpressions, lastMonthImpressions))
    .replace(/{IMPR_BADGE_CLASS}/g, getBadgeClass(imprGrowth))
    .replace(/{IMPR_GROWTH}/g, getGrowthText(imprGrowth))
    .replace(/{CLICKS_DIFF}/g, getDiffText(thisMonthClicks, lastMonthClicks))
    .replace(/{CLICKS_CLASS}/g, getDiffClass(thisMonthClicks, lastMonthClicks))
    .replace(/{CLICKS_BADGE_CLASS}/g, getBadgeClass(clicksGrowth))
    .replace(/{CLICKS_GROWTH}/g, getGrowthText(clicksGrowth))
    .replace(/{ATC_DIFF}/g, getDiffText(thisMonthATC, lastMonthATC))
    .replace(/{ATC_CLASS}/g, getDiffClass(thisMonthATC, lastMonthATC))
    .replace(/{ATC_BADGE_CLASS}/g, getBadgeClass(atcGrowth))
    .replace(/{ATC_GROWTH}/g, getGrowthText(atcGrowth))
    .replace(/{PURCH_DIFF}/g, getDiffText(thisMonthPurchases, lastMonthPurchases))
    .replace(/{PURCH_CLASS}/g, getDiffClass(thisMonthPurchases, lastMonthPurchases))
    .replace(/{PURCH_BADGE_CLASS}/g, getBadgeClass(purchGrowth))
    .replace(/{PURCH_GROWTH}/g, getGrowthText(purchGrowth))
    // Slide 2 - Key Insight
    .replace(/{SPEND_SENTIMENT}/g, spendSentiment)
    .replace(/{PERFORMANCE_SENTIMENT}/g, performanceSentiment)
    .replace(/{CONVERSION_SENTIMENT}/g, conversionSentiment)
    // Slide 3 - Key Insight
    .replace(/{METRIC_PERFORMANCE_DESC}/g, metricPerformanceDesc)
    .replace(/{TOP_PERFORMER_METRIC}/g, topPerformerMetric)
    .replace(/{TOP_PERFORMER_GROWTH}/g, topPerformerGrowth)
    .replace(/{CTR_SENTIMENT}/g, ctrSentiment)
    .replace(/{THIS_CTR}/g, thisMonthCTR.toFixed(2))
    .replace(/{METRICS_RECOMMENDATION}/g, metricsRecommendation)
    // Slide 4 - Key Insights
    .replace(/{GROWTH_SENTIMENT}/g, growthSentiment)
    .replace(/{EFFICIENCY_SENTIMENT}/g, efficiencySentiment)
    .replace(/{PERFORMANCE_HIGHLIGHT}/g, performanceHighlight)
    .replace(/{STRATEGY_RECOMMENDATION_1}/g, strategyRecommendation1)
    .replace(/{STRATEGY_RECOMMENDATION_2}/g, strategyRecommendation2)
    .replace(/{STRATEGY_RECOMMENDATION_3}/g, strategyRecommendation3)
    .replace(/{STRATEGY_RECOMMENDATION_4}/g, strategyRecommendation4)
    // Slide 11 - Conclusion
    .replace(/{CONVERSION_RATE_WIN}/g, conversionRateWin)
    .replace(/{IMPROVEMENT_AREA}/g, improvementArea)
    .replace(/{NEXT_PERIOD_FOCUS}/g, nextPeriodFocus)
    // Slide 12 - Next Steps
    .replace(/{ACTION_STEP_1}/g, actionStep1)
    .replace(/{ACTION_STEP_2}/g, actionStep2)
    .replace(/{ACTION_STEP_3}/g, actionStep3)
    .replace(/{ACTION_STEP_4}/g, actionStep4)
    .replace(/{ACTION_STEP_5}/g, actionStep5)
    .replace(/{ACTION_STEP_6}/g, actionStep6)
    .replace(/{NEXT_MONTH_TARGET}/g, nextMonthTarget)
    .replace(/{TARGET_GROWTH}/g, targetGrowth.toString())
    .replace(/{TARGET_CPR}/g, targetCPR)
    // Slides 5-10: Breakdown tables
    .replace(/{AGE_BREAKDOWN_TABLE}/g, ageBreakdownHTML)
    .replace(/{GENDER_BREAKDOWN_TABLE}/g, genderBreakdownHTML)
    .replace(/{REGION_BREAKDOWN_TABLE}/g, regionBreakdownHTML)
    .replace(/{PLATFORM_BREAKDOWN_TABLE}/g, platformBreakdownHTML)
    .replace(/{PLACEMENT_BREAKDOWN_TABLE}/g, placementBreakdownHTML)
    .replace(/{CREATIVE_BREAKDOWN_TABLE}/g, creativeBreakdownHTML)

  console.log('[CPAS Template] Report generated successfully (inline), length:', html.length)
  return html
}
