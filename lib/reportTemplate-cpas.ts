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
                        <td><strong>CPM</strong></td>
                        <td class="text-right">{LAST_CPM}</td>
                        <td class="text-right">{THIS_CPM}</td>
                        <td class="text-right {CPM_CLASS}">{CPM_DIFF}</td>
                        <td class="text-right"><span class="badge {CPM_BADGE_CLASS}">{CPM_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Outbound Clicks</strong></td>
                        <td class="text-right">{LAST_OUTBOUND_CLICKS}</td>
                        <td class="text-right">{THIS_OUTBOUND_CLICKS}</td>
                        <td class="text-right {OUTBOUND_CLICKS_CLASS}">{OUTBOUND_CLICKS_DIFF}</td>
                        <td class="text-right"><span class="badge {OUTBOUND_CLICKS_BADGE_CLASS}">{OUTBOUND_CLICKS_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>CTR (link click-through rate)</strong></td>
                        <td class="text-right">{LAST_CTR}</td>
                        <td class="text-right">{THIS_CTR}</td>
                        <td class="text-right {CTR_CLASS}">{CTR_DIFF}</td>
                        <td class="text-right"><span class="badge {CTR_BADGE_CLASS}">{CTR_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Adds to cart with shared items</strong></td>
                        <td class="text-right">{LAST_ATC}</td>
                        <td class="text-right">{THIS_ATC}</td>
                        <td class="text-right {ATC_CLASS}">{ATC_DIFF}</td>
                        <td class="text-right"><span class="badge {ATC_BADGE_CLASS}">{ATC_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Cost per add to cart with shared items</strong></td>
                        <td class="text-right">{LAST_COST_PER_ATC}</td>
                        <td class="text-right">{THIS_COST_PER_ATC}</td>
                        <td class="text-right {COST_PER_ATC_CLASS}">{COST_PER_ATC_DIFF}</td>
                        <td class="text-right"><span class="badge {COST_PER_ATC_BADGE_CLASS}">{COST_PER_ATC_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>ATC conversion value (shared only)</strong></td>
                        <td class="text-right">{LAST_ATC_CV}</td>
                        <td class="text-right">{THIS_ATC_CV}</td>
                        <td class="text-right {ATC_CV_CLASS}">{ATC_CV_DIFF}</td>
                        <td class="text-right"><span class="badge {ATC_CV_BADGE_CLASS}">{ATC_CV_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Purchases with shared items</strong></td>
                        <td class="text-right">{LAST_PURCHASES}</td>
                        <td class="text-right">{THIS_PURCHASES}</td>
                        <td class="text-right {PURCH_CLASS}">{PURCH_DIFF}</td>
                        <td class="text-right"><span class="badge {PURCH_BADGE_CLASS}">{PURCH_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Cost per purchases with shared items</strong></td>
                        <td class="text-right">{LAST_COST_PER_PURCHASE}</td>
                        <td class="text-right">{THIS_COST_PER_PURCHASE}</td>
                        <td class="text-right {COST_PER_PURCHASE_CLASS}">{COST_PER_PURCHASE_DIFF}</td>
                        <td class="text-right"><span class="badge {COST_PER_PURCHASE_BADGE_CLASS}">{COST_PER_PURCHASE_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Purchases conversion value for shared items only</strong></td>
                        <td class="text-right">{LAST_PURCHASE_CV}</td>
                        <td class="text-right">{THIS_PURCHASE_CV}</td>
                        <td class="text-right {PURCHASE_CV_CLASS}">{PURCHASE_CV_DIFF}</td>
                        <td class="text-right"><span class="badge {PURCHASE_CV_BADGE_CLASS}">{PURCHASE_CV_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Conversion Rate (Purchase ÷ Click)</strong></td>
                        <td class="text-right">{LAST_CONVERSION_RATE}</td>
                        <td class="text-right">{THIS_CONVERSION_RATE}</td>
                        <td class="text-right {CONVERSION_RATE_CLASS}">{CONVERSION_RATE_DIFF}</td>
                        <td class="text-right"><span class="badge {CONVERSION_RATE_BADGE_CLASS}">{CONVERSION_RATE_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Purchase ROAS (return on ad spend)</strong></td>
                        <td class="text-right">{LAST_ROAS}</td>
                        <td class="text-right">{THIS_ROAS}</td>
                        <td class="text-right {ROAS_CLASS}">{ROAS_DIFF}</td>
                        <td class="text-right"><span class="badge {ROAS_BADGE_CLASS}">{ROAS_GROWTH}%</span></td>
                    </tr>
                    <tr>
                        <td><strong>Average purchases conversion value</strong></td>
                        <td class="text-right">{LAST_AOV}</td>
                        <td class="text-right">{THIS_AOV}</td>
                        <td class="text-right {AOV_CLASS}">{AOV_DIFF}</td>
                        <td class="text-right"><span class="badge {AOV_BADGE_CLASS}">{AOV_GROWTH}%</span></td>
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

        <!-- Two Column Layout: Highlights and Lowlights -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">

            <!-- HIGHLIGHTS COLUMN -->
            <div>
                <h3 style="color: #10b981; margin-bottom: 16px; font-size: 18px; font-weight: 600;">
                    Highlights
                </h3>
                <div style="background: #e6f7f0; border-left: 3px solid #10b981; padding: 20px; border-radius: 8px;">
                    <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
                        <li style="margin-bottom: 12px; color: #333333;">
                            <span style="color: #10b981; font-weight: 600; margin-right: 8px;">☑</span>
                            <strong>{THIS_ATC} Add to Cart</strong>
                            <div style="font-size: 13px; color: #666666; margin-top: 4px; margin-left: 24px;">
                                Konversi pertama tercapai dengan CPR {THIS_CPR}
                            </div>
                        </li>
                        <li style="margin-bottom: 12px; color: #333333;">
                            <span style="color: #10b981; font-weight: 600; margin-right: 8px;">☑</span>
                            <strong>{THIS_PURCHASES} Purchases</strong>
                            <div style="font-size: 13px; color: #666666; margin-top: 4px; margin-left: 24px;">
                                ROAS {THIS_ROAS}, AOV {THIS_AOV}
                            </div>
                        </li>
                        <li style="margin-bottom: 12px; color: #333333;">
                            <span style="color: #10b981; font-weight: 600; margin-right: 8px;">☑</span>
                            <strong>CPM {CPM_SENTIMENT} {CPM_CHANGE_ABS}%</strong>
                            <div style="font-size: 13px; color: #666666; margin-top: 4px; margin-left: 24px;">
                                {CPM_INSIGHT}
                            </div>
                        </li>
                        <li style="margin-bottom: 12px; color: #333333;">
                            <span style="color: #10b981; font-weight: 600; margin-right: 8px;">☑</span>
                            <strong>{THIS_IG_FOLLOWS} New Followers</strong>
                            <div style="font-size: 13px; color: #666666; margin-top: 4px; margin-left: 24px;">
                                Instagram community growth
                            </div>
                        </li>
                        <li style="color: #333333;">
                            <span style="color: #10b981; font-weight: 600; margin-right: 8px;">☑</span>
                            <strong>{THIS_IG_PROFILE_VISITS} Profile Visits</strong>
                            <div style="font-size: 13px; color: #666666; margin-top: 4px; margin-left: 24px;">
                                Significant brand awareness increase
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- LOWLIGHTS COLUMN -->
            <div>
                <h3 style="color: #ef4444; margin-bottom: 16px; font-size: 18px; font-weight: 600;">
                    Lowlights
                </h3>
                <div style="background: #fce7e7; border-left: 3px solid #ef4444; padding: 20px; border-radius: 8px;">
                    <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
                        <li style="margin-bottom: 12px; color: #333333;">
                            <span style="color: #ef4444; font-weight: 600; margin-right: 8px;">☐</span>
                            <strong>CTR {CTR_SENTIMENT_LOW} {CTR_CHANGE_ABS}%</strong>
                            <div style="font-size: 13px; color: #666666; margin-top: 4px; margin-left: 24px;">
                                {CTR_INSIGHT}
                            </div>
                        </li>
                        <li style="margin-bottom: 12px; color: #333333;">
                            <span style="color: #ef4444; font-weight: 600; margin-right: 8px;">☐</span>
                            <strong>CPC {CPC_SENTIMENT} {CPC_CHANGE_ABS}%</strong>
                            <div style="font-size: 13px; color: #666666; margin-top: 4px; margin-left: 24px;">
                                {CPC_INSIGHT}
                            </div>
                        </li>
                        <li style="color: #333333;">
                            <span style="color: #ef4444; font-weight: 600; margin-right: 8px;">☐</span>
                            <strong>{LOWLIGHT_THIRD_ITEM}</strong>
                            <div style="font-size: 13px; color: #666666; margin-top: 4px; margin-left: 24px;">
                                {LOWLIGHT_THIRD_DETAIL}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- INSIGHT BOX -->
        <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 16px; border-radius: 8px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -10px; right: -10px; font-size: 60px; opacity: 0.1;">💡</div>
            <p style="color: #92400e; line-height: 1.7; font-weight: 500; position: relative; z-index: 1; margin: 0; font-size: 14px;">
                <strong>Insight:</strong> {INSIGHT_SUMMARY}
            </p>
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
  const thisMonthClicks = thisMonthData.outboundClicks || thisMonthData.clicks || thisMonthData.linkClicks || 0
  const lastMonthClicks = lastMonthData.outboundClicks || lastMonthData.clicks || lastMonthData.linkClicks || 0
  const thisMonthCTR = thisMonthData.ctr || (thisMonthClicks > 0 && thisMonthImpressions > 0 ? (thisMonthClicks / thisMonthImpressions * 100) : 0)
  const lastMonthCTR = lastMonthData.ctr || (lastMonthClicks > 0 && lastMonthImpressions > 0 ? (lastMonthClicks / lastMonthImpressions * 100) : 0)
  const thisMonthPurchases = thisMonthData.purchases || 0
  const lastMonthPurchases = lastMonthData.purchases || 0

  // Extract additional metrics for Detailed Performance Metrics table
  const thisMonthCPC = thisMonthData.cpc || 0
  const lastMonthCPC = lastMonthData.cpc || 0
  const thisMonthCPM = thisMonthData.cpm || 0
  const lastMonthCPM = lastMonthData.cpm || 0
  // Use thisMonthClicks/lastMonthClicks for outbound clicks (defined above)
  const thisMonthOutboundClicks = thisMonthClicks
  const lastMonthOutboundClicks = lastMonthClicks
  const thisMonthContentViews = thisMonthData.contentViews || 0
  const lastMonthContentViews = lastMonthData.contentViews || 0
  const thisMonthIGProfileVisits = thisMonthData.igProfileVisits || 0
  const lastMonthIGProfileVisits = lastMonthData.igProfileVisits || 0
  const thisMonthIGFollows = thisMonthData.igFollows || 0
  const lastMonthIGFollows = lastMonthData.igFollows || 0

  // Extract cost metrics from API
  const thisMonthCostPerATC = thisMonthData.costPerATC || 0
  const lastMonthCostPerATC = lastMonthData.costPerATC || 0
  const thisMonthATCCV = thisMonthData.atcConversionValue || 0
  const lastMonthATCCV = lastMonthData.atcConversionValue || 0
  const thisMonthCostPerPurchase = thisMonthData.costPerPurchase || 0
  const lastMonthCostPerPurchase = lastMonthData.costPerPurchase || 0
  const thisMonthPurchaseCV = thisMonthData.purchasesConversionValue || 0
  const lastMonthPurchaseCV = lastMonthData.purchasesConversionValue || 0
  const thisMonthROAS = thisMonthData.purchaseROAS || 0
  const lastMonthROAS = lastMonthData.purchaseROAS || 0
  const thisMonthAOV = thisMonthData.aov || 0
  const lastMonthAOV = lastMonthData.aov || 0

  // Calculate Conversion Rate (Purchase ÷ Link Clicks)
  const thisMonthConversionRate = thisMonthClicks > 0 ? (thisMonthPurchases / thisMonthClicks) * 100 : 0
  const lastMonthConversionRate = lastMonthClicks > 0 ? (lastMonthPurchases / lastMonthClicks) * 100 : 0

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

  // Calculate growth for additional metrics
  const ctrGrowth = lastMonthCTR > 0 ? ((thisMonthCTR - lastMonthCTR) / lastMonthCTR * 100) : 0
  const cpcGrowth = lastMonthCPC > 0 ? ((thisMonthCPC - lastMonthCPC) / lastMonthCPC * 100) : 0
  const cpmGrowth = lastMonthCPM > 0 ? ((thisMonthCPM - lastMonthCPM) / lastMonthCPM * 100) : 0
  const outboundClicksGrowth = lastMonthOutboundClicks > 0 ? ((thisMonthOutboundClicks - lastMonthOutboundClicks) / lastMonthOutboundClicks * 100) : 0
  const contentViewsGrowth = lastMonthContentViews > 0 ? ((thisMonthContentViews - lastMonthContentViews) / lastMonthContentViews * 100) : 0
  const igProfileVisitsGrowth = lastMonthIGProfileVisits > 0 ? ((thisMonthIGProfileVisits - lastMonthIGProfileVisits) / lastMonthIGProfileVisits * 100) : 0
  const igFollowsGrowth = lastMonthIGFollows > 0 ? ((thisMonthIGFollows - lastMonthIGFollows) / lastMonthIGFollows * 100) : 0

  // Calculate growth for new metrics
  const costPerATCGrowth = lastMonthCostPerATC > 0 ? ((thisMonthCostPerATC - lastMonthCostPerATC) / lastMonthCostPerATC * 100) : 0
  const atcCVGrowth = lastMonthATCCV > 0 ? ((thisMonthATCCV - lastMonthATCCV) / lastMonthATCCV * 100) : 0
  const costPerPurchaseGrowth = lastMonthCostPerPurchase > 0 ? ((thisMonthCostPerPurchase - lastMonthCostPerPurchase) / lastMonthCostPerPurchase * 100) : 0
  const purchaseCVGrowth = lastMonthPurchaseCV > 0 ? ((thisMonthPurchaseCV - lastMonthPurchaseCV) / lastMonthPurchaseCV * 100) : 0
  const conversionRateGrowth = lastMonthConversionRate > 0 ? ((thisMonthConversionRate - lastMonthConversionRate) / lastMonthConversionRate * 100) : 0
  const roasGrowth = lastMonthROAS > 0 ? ((thisMonthROAS - lastMonthROAS) / lastMonthROAS * 100) : 0
  const aovGrowth = lastMonthAOV > 0 ? ((thisMonthAOV - lastMonthAOV) / lastMonthAOV * 100) : 0

  // Helper to determine badge class and growth text
  const getBadgeClass = (growth: number) => growth >= 0 ? 'badge-green' : 'badge-red'
  const getGrowthText = (growth: number) => (growth > 0 ? '+' : '') + formatPercent(growth)
  const getDiffText = (thisVal: number, lastVal: number) => ((thisVal - lastVal) >= 0 ? '+' : '') + formatNumber(Math.abs(thisVal - lastVal))
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
          <td style="font-size: 13px;"><strong>${name}</strong></td>
          <td class="text-right" style="font-size: 13px;">${formatNumber(impressions)}</td>
          <td class="text-right" style="font-size: 13px;">${ctr}%</td>
          <td class="text-right" style="font-size: 13px; font-weight: 600;">${formatNumber(atc)}</td>
          <td class="text-right" style="font-size: 13px; font-weight: 600;">${formatCurrency(cpr)}</td>
          <td class="text-right" style="font-size: 13px;">${formatCurrency(spend)}</td>
        </tr>
      `
    }).join('')

    return `
      <div style="overflow-x: auto; margin-bottom: 24px;">
        <table style="font-size: 13px;">
          <thead>
            <tr>
              <th style="width: 25%;">${dimensionName}</th>
              <th class="text-right" style="width: 15%;">Impressions</th>
              <th class="text-right" style="width: 10%;">CTR</th>
              <th class="text-right" style="width: 15%;">Add to Cart</th>
              <th class="text-right" style="width: 15%;">CPR</th>
              <th class="text-right" style="width: 20%;">Amount Spent (IDR)</th>
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
  // Variables for Slide 4 - removed unused variables from old design
  const spendSentiment = spendGrowth >= 0 ? 'sebanding' : 'perlu evaluasi'
  const performanceSentiment = atcGrowth >= 0 ? 'menggembirakan' : 'perlu improvement'
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
    // Additional metrics for Detailed Performance Metrics
    .replace(/{LAST_CTR}/g, lastMonthCTR > 0 ? lastMonthCTR.toFixed(2) + '%' : '0.00%')
    .replace(/{THIS_CTR}/g, thisMonthCTR.toFixed(2) + '%')
    .replace(/{CTR_DIFF}/g, (thisMonthCTR - lastMonthCTR >= 0 ? '+' : '') + (thisMonthCTR - lastMonthCTR).toFixed(2) + '%')
    .replace(/{CTR_CLASS}/g, getDiffClass(thisMonthCTR, lastMonthCTR))
    .replace(/{CTR_BADGE_CLASS}/g, getBadgeClass(ctrGrowth))
    .replace(/{CTR_GROWTH}/g, lastMonthCTR > 0 ? getGrowthText(ctrGrowth) : 'N/A')
    .replace(/{LAST_CPC}/g, formatCurrency(lastMonthCPC))
    .replace(/{THIS_CPC}/g, formatCurrency(thisMonthCPC))
    .replace(/{CPC_DIFF}/g, (thisMonthCPC - lastMonthCPC >= 0 ? '+' : '') + formatCurrency(Math.abs(thisMonthCPC - lastMonthCPC)))
    .replace(/{CPC_CLASS}/g, getDiffClass(thisMonthCPC, lastMonthCPC))
    .replace(/{CPC_BADGE_CLASS}/g, getBadgeClass(cpcGrowth))
    .replace(/{CPC_GROWTH}/g, lastMonthCPC > 0 ? getGrowthText(cpcGrowth) : 'N/A')
    .replace(/{LAST_CPM}/g, formatCurrency(lastMonthCPM))
    .replace(/{THIS_CPM}/g, formatCurrency(thisMonthCPM))
    .replace(/{CPM_DIFF}/g, (thisMonthCPM - lastMonthCPM >= 0 ? '+' : '') + formatCurrency(Math.abs(thisMonthCPM - lastMonthCPM)))
    .replace(/{CPM_CLASS}/g, getDiffClass(thisMonthCPM, lastMonthCPM))
    .replace(/{CPM_BADGE_CLASS}/g, getBadgeClass(cpmGrowth))
    .replace(/{CPM_GROWTH}/g, lastMonthCPM > 0 ? getGrowthText(cpmGrowth) : 'N/A')
    .replace(/{LAST_OUTBOUND_CLICKS}/g, formatNumber(lastMonthOutboundClicks))
    .replace(/{THIS_OUTBOUND_CLICKS}/g, formatNumber(thisMonthOutboundClicks))
    .replace(/{OUTBOUND_CLICKS_DIFF}/g, getDiffText(thisMonthOutboundClicks, lastMonthOutboundClicks))
    .replace(/{OUTBOUND_CLICKS_CLASS}/g, getDiffClass(thisMonthOutboundClicks, lastMonthOutboundClicks))
    .replace(/{OUTBOUND_CLICKS_BADGE_CLASS}/g, getBadgeClass(outboundClicksGrowth))
    .replace(/{OUTBOUND_CLICKS_GROWTH}/g, lastMonthOutboundClicks > 0 ? getGrowthText(outboundClicksGrowth) : 'N/A')
    .replace(/{LAST_CONTENT_VIEWS}/g, formatNumber(lastMonthContentViews))
    .replace(/{THIS_CONTENT_VIEWS}/g, formatNumber(thisMonthContentViews))
    .replace(/{CONTENT_VIEWS_DIFF}/g, getDiffText(thisMonthContentViews, lastMonthContentViews))
    .replace(/{CONTENT_VIEWS_CLASS}/g, getDiffClass(thisMonthContentViews, lastMonthContentViews))
    .replace(/{CONTENT_VIEWS_BADGE_CLASS}/g, getBadgeClass(contentViewsGrowth))
    .replace(/{CONTENT_VIEWS_GROWTH}/g, lastMonthContentViews > 0 ? getGrowthText(contentViewsGrowth) : 'N/A')
    .replace(/{LAST_IG_PROFILE_VISITS}/g, formatNumber(lastMonthIGProfileVisits))
    .replace(/{THIS_IG_PROFILE_VISITS}/g, formatNumber(thisMonthIGProfileVisits))
    .replace(/{IG_PROFILE_VISITS_DIFF}/g, getDiffText(thisMonthIGProfileVisits, lastMonthIGProfileVisits))
    .replace(/{IG_PROFILE_VISITS_CLASS}/g, getDiffClass(thisMonthIGProfileVisits, lastMonthIGProfileVisits))
    .replace(/{IG_PROFILE_VISITS_BADGE_CLASS}/g, getBadgeClass(igProfileVisitsGrowth))
    .replace(/{IG_PROFILE_VISITS_GROWTH}/g, lastMonthIGProfileVisits > 0 ? getGrowthText(igProfileVisitsGrowth) : 'N/A')
    .replace(/{LAST_IG_FOLLOWS}/g, formatNumber(lastMonthIGFollows))
    .replace(/{THIS_IG_FOLLOWS}/g, formatNumber(thisMonthIGFollows))
    .replace(/{IG_FOLLOWS_DIFF}/g, getDiffText(thisMonthIGFollows, lastMonthIGFollows))
    .replace(/{IG_FOLLOWS_CLASS}/g, getDiffClass(thisMonthIGFollows, lastMonthIGFollows))
    .replace(/{IG_FOLLOWS_BADGE_CLASS}/g, getBadgeClass(igFollowsGrowth))
    .replace(/{IG_FOLLOWS_GROWTH}/g, lastMonthIGFollows > 0 ? getGrowthText(igFollowsGrowth) : 'N/A')
    // Additional metrics for Detailed Performance Metrics table
    .replace(/{LAST_COST_PER_ATC}/g, formatCurrency(lastMonthCostPerATC))
    .replace(/{THIS_COST_PER_ATC}/g, formatCurrency(thisMonthCostPerATC))
    .replace(/{COST_PER_ATC_DIFF}/g, (thisMonthCostPerATC - lastMonthCostPerATC >= 0 ? '+' : '') + formatCurrency(Math.abs(thisMonthCostPerATC - lastMonthCostPerATC)))
    .replace(/{COST_PER_ATC_CLASS}/g, getDiffClass(thisMonthCostPerATC, lastMonthCostPerATC))
    .replace(/{COST_PER_ATC_BADGE_CLASS}/g, getBadgeClass(costPerATCGrowth))
    .replace(/{COST_PER_ATC_GROWTH}/g, lastMonthCostPerATC > 0 ? getGrowthText(costPerATCGrowth) : 'N/A')
    .replace(/{LAST_ATC_CV}/g, formatCurrency(lastMonthATCCV))
    .replace(/{THIS_ATC_CV}/g, formatCurrency(thisMonthATCCV))
    .replace(/{ATC_CV_DIFF}/g, (thisMonthATCCV - lastMonthATCCV >= 0 ? '+' : '') + formatCurrency(Math.abs(thisMonthATCCV - lastMonthATCCV)))
    .replace(/{ATC_CV_CLASS}/g, getDiffClass(thisMonthATCCV, lastMonthATCCV))
    .replace(/{ATC_CV_BADGE_CLASS}/g, getBadgeClass(atcCVGrowth))
    .replace(/{ATC_CV_GROWTH}/g, lastMonthATCCV > 0 ? getGrowthText(atcCVGrowth) : 'N/A')
    .replace(/{LAST_COST_PER_PURCHASE}/g, formatCurrency(lastMonthCostPerPurchase))
    .replace(/{THIS_COST_PER_PURCHASE}/g, formatCurrency(thisMonthCostPerPurchase))
    .replace(/{COST_PER_PURCHASE_DIFF}/g, (thisMonthCostPerPurchase - lastMonthCostPerPurchase >= 0 ? '+' : '') + formatCurrency(Math.abs(thisMonthCostPerPurchase - lastMonthCostPerPurchase)))
    .replace(/{COST_PER_PURCHASE_CLASS}/g, getDiffClass(thisMonthCostPerPurchase, lastMonthCostPerPurchase))
    .replace(/{COST_PER_PURCHASE_BADGE_CLASS}/g, getBadgeClass(costPerPurchaseGrowth))
    .replace(/{COST_PER_PURCHASE_GROWTH}/g, lastMonthCostPerPurchase > 0 ? getGrowthText(costPerPurchaseGrowth) : 'N/A')
    .replace(/{LAST_PURCHASE_CV}/g, formatCurrency(lastMonthPurchaseCV))
    .replace(/{THIS_PURCHASE_CV}/g, formatCurrency(thisMonthPurchaseCV))
    .replace(/{PURCHASE_CV_DIFF}/g, (thisMonthPurchaseCV - lastMonthPurchaseCV >= 0 ? '+' : '') + formatCurrency(Math.abs(thisMonthPurchaseCV - lastMonthPurchaseCV)))
    .replace(/{PURCHASE_CV_CLASS}/g, getDiffClass(thisMonthPurchaseCV, lastMonthPurchaseCV))
    .replace(/{PURCHASE_CV_BADGE_CLASS}/g, getBadgeClass(purchaseCVGrowth))
    .replace(/{PURCHASE_CV_GROWTH}/g, lastMonthPurchaseCV > 0 ? getGrowthText(purchaseCVGrowth) : 'N/A')
    .replace(/{LAST_CONVERSION_RATE}/g, lastMonthConversionRate.toFixed(2) + '%')
    .replace(/{THIS_CONVERSION_RATE}/g, thisMonthConversionRate.toFixed(2) + '%')
    .replace(/{CONVERSION_RATE_DIFF}/g, (thisMonthConversionRate - lastMonthConversionRate >= 0 ? '+' : '') + (thisMonthConversionRate - lastMonthConversionRate).toFixed(2) + '%')
    .replace(/{CONVERSION_RATE_CLASS}/g, getDiffClass(thisMonthConversionRate, lastMonthConversionRate))
    .replace(/{CONVERSION_RATE_BADGE_CLASS}/g, getBadgeClass(conversionRateGrowth))
    .replace(/{CONVERSION_RATE_GROWTH}/g, lastMonthConversionRate > 0 ? getGrowthText(conversionRateGrowth) : 'N/A')
    .replace(/{LAST_ROAS}/g, lastMonthROAS.toFixed(2))
    .replace(/{THIS_ROAS}/g, thisMonthROAS.toFixed(2))
    .replace(/{ROAS_DIFF}/g, (thisMonthROAS - lastMonthROAS >= 0 ? '+' : '') + (thisMonthROAS - lastMonthROAS).toFixed(2))
    .replace(/{ROAS_CLASS}/g, getDiffClass(thisMonthROAS, lastMonthROAS))
    .replace(/{ROAS_BADGE_CLASS}/g, getBadgeClass(roasGrowth))
    .replace(/{ROAS_GROWTH}/g, lastMonthROAS > 0 ? getGrowthText(roasGrowth) : 'N/A')
    .replace(/{LAST_AOV}/g, formatCurrency(lastMonthAOV))
    .replace(/{THIS_AOV}/g, formatCurrency(thisMonthAOV))
    .replace(/{AOV_DIFF}/g, (thisMonthAOV - lastMonthAOV >= 0 ? '+' : '') + formatCurrency(Math.abs(thisMonthAOV - lastMonthAOV)))
    .replace(/{AOV_CLASS}/g, getDiffClass(thisMonthAOV, lastMonthAOV))
    .replace(/{AOV_BADGE_CLASS}/g, getBadgeClass(aovGrowth))
    .replace(/{AOV_GROWTH}/g, lastMonthAOV > 0 ? getGrowthText(aovGrowth) : 'N/A')
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
    // Slide 4 - Highlights & Lowlights
    .replace(/{CPM_SENTIMENT}/g, cpmGrowth >= 0 ? 'Naik' : 'Turun')
    .replace(/{CPM_CHANGE_ABS}/g, formatNumber(Math.abs(cpmGrowth)))
    .replace(/{CPM_INSIGHT}/g, `Impressions cost ${cpmGrowth >= 0 ? 'less' : 'more'} efficient at Rp ${formatNumber(thisMonthCPM)} per 1,000`)
    .replace(/{CTR_SENTIMENT_LOW}/g, ctrGrowth >= 0 ? 'Naik' : 'Turun')
    .replace(/{CTR_CHANGE_ABS}/g, formatNumber(Math.abs(ctrGrowth)))
    .replace(/{CTR_INSIGHT}/g, lastMonthCTR > 0 ? `Dari ${lastMonthCTR.toFixed(2)}% ke ${thisMonthCTR.toFixed(2)}% karena ekspansi reach ke audiens baru` : `CTR mencapai ${thisMonthCTR.toFixed(2)}%`)
    .replace(/{CPC_SENTIMENT}/g, cpcGrowth >= 0 ? 'Naik' : 'Turun')
    .replace(/{CPC_CHANGE_ABS}/g, formatNumber(Math.abs(cpcGrowth)))
    .replace(/{CPC_INSIGHT}/g, lastMonthCPC > 0 ? `Dari Rp ${formatNumber(lastMonthCPC)} ke Rp ${formatNumber(thisMonthCPC)} per click` : `CPC Rp ${formatNumber(thisMonthCPC)} per click`)
    .replace(/{LOWLIGHT_THIRD_ITEM}/g, lastMonthATC === 0 && lastMonthPurchases === 0 ? `${lastPeriodLabel} Tanpa Konversi` : 'Perlu optimalisasi konversi')
    .replace(/{LOWLIGHT_THIRD_DETAIL}/g, lastMonthATC === 0 && lastMonthPurchases === 0 ? `Campaign ${lastPeriodLabel} belum mencapai konversi ATC/purchases` : 'Tingkatkan conversion rate dari ATC ke Purchase')
    .replace(/{INSIGHT_SUMMARY}/g, `Campaign performance ${thisPeriodLabel} menunjukkan ${atcGrowth >= 0 ? 'pertumbuhan positif' : 'tantangan'} dengan ${thisMonthATC} Add to Cart. ${thisMonthPurchases > 0 ? `ROAS ${thisMonthROAS} menunjukkan ${thisMonthROAS >= 1 ? 'profitabilitas baik' : 'perlu improvement'}.` : 'Perlu fokus pada peningkatan conversion rate.'} ${ctrGrowth < 0 ? 'CTR perlu dioptimasi untuk effectiveness lebih baik.' : 'Pertahankan momentum positif dan scale winning campaigns.'}`)
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
