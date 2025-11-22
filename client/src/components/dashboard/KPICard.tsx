import React from 'react';
import type { LucideIcon } from 'lucide-react';
import './KPICard.css';

interface KPICardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    color = 'primary',
}) => {
    return (
        <div className="kpi-card card animate-fade-in">
            <div className="kpi-card-header">
                <div className={`kpi-card-icon kpi-card-icon-${color}`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className={`kpi-card-trend ${trend.isPositive ? 'trend-positive' : 'trend-negative'}`}>
                        {trend.isPositive ? '+' : ''}{trend.value}%
                    </span>
                )}
            </div>
            <div className="kpi-card-body">
                <h3 className="kpi-card-value">{value}</h3>
                <p className="kpi-card-title">{title}</p>
            </div>
        </div>
    );
};
