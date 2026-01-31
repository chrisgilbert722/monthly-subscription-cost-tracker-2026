import { useState } from 'react';

interface SubscriptionInput {
    streaming: number;
    software: number;
    memberships: number;
    billingFrequency: 'monthly' | 'annual';
}

const SUBSCRIPTION_TIPS: string[] = [
    'Review subscriptions quarterly to identify unused services',
    'Consider annual billing for frequently used services',
    'Share family plans when possible to reduce costs',
    'Set calendar reminders before free trials end'
];

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);

function App() {
    const [values, setValues] = useState<SubscriptionInput>({ streaming: 45, software: 30, memberships: 50, billingFrequency: 'monthly' });
    const handleChange = (field: keyof SubscriptionInput, value: string | number) => setValues(prev => ({ ...prev, [field]: value }));

    // Calculate totals based on billing frequency
    let streamingMonthly = values.streaming;
    let softwareMonthly = values.software;
    let membershipsMonthly = values.memberships;

    // If annual billing, convert to monthly equivalent
    if (values.billingFrequency === 'annual') {
        streamingMonthly = values.streaming / 12;
        softwareMonthly = values.software / 12;
        membershipsMonthly = values.memberships / 12;
    }

    const totalMonthly = streamingMonthly + softwareMonthly + membershipsMonthly;
    const totalAnnual = totalMonthly * 12;

    // Count active categories
    const activeCategories = [values.streaming, values.software, values.memberships].filter(v => v > 0).length;
    const avgPerService = activeCategories > 0 ? totalMonthly / activeCategories : 0;

    const breakdownData = [
        { category: 'Streaming Services', monthly: streamingMonthly, annual: streamingMonthly * 12 },
        { category: 'Software Subscriptions', monthly: softwareMonthly, annual: softwareMonthly * 12 },
        { category: 'Memberships', monthly: membershipsMonthly, annual: membershipsMonthly * 12 },
        { category: 'Total', monthly: totalMonthly, annual: totalAnnual, isTotal: true },
    ];

    return (
        <main style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <header style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
                <h1 style={{ marginBottom: 'var(--space-2)' }}>Monthly Subscription Cost Tracker (2026)</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>Track your total subscription spending</p>
            </header>

            <div className="card">
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    <div>
                        <label htmlFor="billingFrequency">Enter Costs As</label>
                        <select id="billingFrequency" value={values.billingFrequency} onChange={(e) => handleChange('billingFrequency', e.target.value)}>
                            <option value="monthly">Monthly Amounts</option>
                            <option value="annual">Annual Amounts</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="streaming">Streaming Services ($)</label>
                        <input id="streaming" type="number" min="0" max="1000" step="0.01" value={values.streaming || ''} onChange={(e) => handleChange('streaming', parseFloat(e.target.value) || 0)} placeholder="45.00" />
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>Netflix, Spotify, Disney+, etc.</div>
                    </div>
                    <div>
                        <label htmlFor="software">Software Subscriptions ($)</label>
                        <input id="software" type="number" min="0" max="1000" step="0.01" value={values.software || ''} onChange={(e) => handleChange('software', parseFloat(e.target.value) || 0)} placeholder="30.00" />
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>Adobe, Microsoft 365, cloud storage, etc.</div>
                    </div>
                    <div>
                        <label htmlFor="memberships">Memberships ($)</label>
                        <input id="memberships" type="number" min="0" max="1000" step="0.01" value={values.memberships || ''} onChange={(e) => handleChange('memberships', parseFloat(e.target.value) || 0)} placeholder="50.00" />
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>Gym, Amazon Prime, Costco, etc.</div>
                    </div>
                    <button className="btn-primary" type="button">Calculate Total</button>
                </div>
            </div>

            <div className="card results-panel">
                <div className="text-center">
                    <h2 className="result-label" style={{ marginBottom: 'var(--space-2)' }}>Total Monthly Subscription Cost</h2>
                    <div className="result-hero">{fmt(totalMonthly)}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>per month</div>
                </div>
                <hr className="result-divider" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', textAlign: 'center' }}>
                    <div>
                        <div className="result-label">Annual Cost</div>
                        <div className="result-value">{fmt(totalAnnual)}</div>
                    </div>
                    <div style={{ borderLeft: '1px solid #BAE6FD', paddingLeft: 'var(--space-4)' }}>
                        <div className="result-label">Avg Per Category</div>
                        <div className="result-value">{fmt(avgPerService)}</div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-4)' }}>Money-Saving Tips</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
                    {SUBSCRIPTION_TIPS.map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', flexShrink: 0 }} />{item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="ad-container"><span>Advertisement</span></div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1rem' }}>Cost Breakdown</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>Category</th>
                            <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', color: 'var(--color-text-secondary)' }}>Monthly</th>
                            <th style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'right', color: 'var(--color-text-secondary)' }}>Annual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {breakdownData.map((row, i) => (
                            <tr key={i} style={{ borderBottom: i === breakdownData.length - 1 ? 'none' : '1px solid var(--color-border)', backgroundColor: row.isTotal ? '#F0F9FF' : (i % 2 ? '#F8FAFC' : 'transparent') }}>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', color: 'var(--color-text-secondary)', fontWeight: row.isTotal ? 600 : 400 }}>{row.category}</td>
                                <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', fontWeight: 600 }}>{fmt(row.monthly)}</td>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'right', fontWeight: 600, color: row.isTotal ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>{fmt(row.annual)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <p>This calculator helps you track and estimate your recurring subscription costs. Enter the amounts you currently pay for each category to see your total monthly and annual spending. The figures shown are estimates only based on the values you provide. Actual costs may vary with price changes, promotions, or billing adjustments. Review your actual statements for precise figures.</p>
            </div>

            <footer style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-8)' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', fontSize: '0.875rem' }}>
                    <li>• Estimates only</li><li>• Simplified tracking</li><li>• Free to use</li>
                </ul>
                <p style={{ marginTop: 'var(--space-4)', fontSize: '0.75rem' }}>&copy; 2026 Subscription Cost Tracker</p>
            </footer>

            <div className="ad-container ad-sticky"><span>Advertisement</span></div>
        </main>
    );
}

export default App;
