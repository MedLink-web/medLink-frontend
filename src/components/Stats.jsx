import React from 'react';
import './Stats.css';

const Stats = () => {
    const statsData = [
        { id: 1, number: '+10K', label: 'مستخدم نشط', icon: '👥' },
        { id: 2, number: '+500', label: 'طبيب معتمد', icon: '🩺' },
        { id: 3, number: '+1K', label: 'موعد محجوز', icon: '📅' },
        { id: 4, number: '+50', label: 'مركز طبي', icon: '🏢' },
    ];

    return (
        <div className="stats-outer-wrapper">
        <div className="stats-container">
            {statsData.map((stat, index) => (
            <div key={stat.id} className="stat-item-box">
                
                {/* الصف العلوي: يجمع الرقم والأيقونة معاً */}
                <div className="stat-top-row">
                <span className="stat-number">{stat.number}</span>
                <span className="stat-icon">{stat.icon}</span>
                </div>
                
                {/* الصف السفلي: اسم الإحصائية */}
                <div className="stat-label">{stat.label}</div>
                
            </div>
            ))}
        </div>
        </div>
    );
};

export default Stats;