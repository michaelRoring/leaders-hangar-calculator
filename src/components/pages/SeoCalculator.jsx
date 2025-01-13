import { useState, useMemo } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Input Group with Tooltip Component
const InputGroupWithTooltip = ({
  label,
  id,
  tooltipText,
  children,
  style = {},
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      style={{
        ...style,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <label htmlFor={id} style={{ fontSize: "0.9rem", color: "#666" }}>
          {label}
        </label>
        <span
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{
            cursor: "pointer",
            color: "#666",
            fontSize: "1rem",
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            backgroundColor: "#f0f0f0",
          }}
        >
          ⓘ
        </span>
      </div>
      {children}
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            right: "0",
            backgroundColor: "#333",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "0.8rem",
            zIndex: 1000,
            maxWidth: "250px",
            marginTop: "4px",
          }}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
};

// Profit Loss Summary Component
const ProfitLossSummary = ({ chartData = {}, currency = "$" }) => {
  const totalRevenue = chartData?.totalRevenue ?? 0;
  const totalCosts = chartData?.totalCosts ?? 0;
  const totalProfit = chartData?.totalProfit ?? 0;

  const cardStyle = {
    padding: "25px",
    background: "linear-gradient(145deg, #1a237e, #283593)",
    borderRadius: "16px",
    maxWidth: "600px",
    margin: "0 auto",
    boxShadow: "0 10px 20px rgba(26, 35, 126, 0.2)",
    color: "#fff",
  };

  const titleStyle = {
    fontSize: "1.75rem",
    fontWeight: "600",
    marginBottom: "25px",
    color: "#fff",
    textAlign: "center",
    letterSpacing: "0.5px",
    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "25px",
    padding: "10px",
  };

  const itemStyle = {
    padding: "20px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    cursor: "pointer",
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    },
  };

  const labelStyle = {
    fontSize: "1rem",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: "12px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: "500",
  };

  const valueStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  const valueWrapperStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const getValueColor = (value) => {
    if (value === totalProfit) {
      return value >= 0 ? "#4caf50" : "#f44336";
    }
    return "#fff";
  };

  const currencyStyle = {
    fontSize: "1rem",
    opacity: 0.8,
    marginRight: "4px",
  };

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>Profit and Loss Summary</h2>
      <div style={gridStyle}>
        <div style={itemStyle}>
          <div style={valueWrapperStyle}>
            <p style={labelStyle}>Revenue</p>
            <p style={{ ...valueStyle, color: getValueColor(totalRevenue) }}>
              <span style={currencyStyle}>{currency}</span>
              {totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
        <div style={itemStyle}>
          <div style={valueWrapperStyle}>
            <p style={labelStyle}>Costs</p>
            <p style={{ ...valueStyle, color: getValueColor(totalCosts) }}>
              <span style={currencyStyle}>{currency}</span>
              {totalCosts.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
        <div style={itemStyle}>
          <div style={valueWrapperStyle}>
            <p style={labelStyle}>Profit</p>
            <p style={{ ...valueStyle, color: getValueColor(totalProfit) }}>
              <span style={currencyStyle}>{currency}</span>
              {totalProfit.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function SeoCalculator() {
  const [monthlyTrafficIncrease, setMonthlyTrafficIncrease] = useState(1100);
  const [conversionRate, setConversionRate] = useState(2.0);
  const [averageOrderValue, setAverageOrderValue] = useState(60);
  const [seoCampaignCost, setSeoCampaignCost] = useState(1100);
  const [otherCosts, setOtherCosts] = useState(0);
  const [forecastMonths, setForecastMonths] = useState(12);
  const [currency, setCurrency] = useState("$");

  const currencyOptions = [
    { value: "$", label: "USD - US Dollar" },
    { value: "€", label: "EUR - Euro" },
    { value: "£", label: "GBP - British Pound" },
    { value: "¥", label: "JPY - Japanese Yen" },
    { value: "₹", label: "INR - Indian Rupee" },
    { value: "C$", label: "CAD - Canadian Dollar" },
    { value: "A$", label: "AUD - Australian Dollar" },
    { value: "CHF", label: "CHF - Swiss Franc" },
    { value: "CN¥", label: "CNY - Chinese Yuan" },
    { value: "KR₩", label: "KRW - South Korean Won" },
  ];

  const tooltipTexts = {
    monthlyTrafficIncrease:
      "Enter the estimated increase in monthly website traffic.",
    conversionRate:
      "Set the expected percentage of website visitors who will convert into customers.",
    averageOrderValue: "Enter the average revenue generated per customer.",
    seoCampaignCost: "Enter the planned monthly investment for SEO activities.",
    otherCosts:
      "Enter any additional monthly expenses related to the campaign.",
    forecastMonths: "Set the planning timeline in months.",
    currency: "Select the currency for the financial figures.",
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const chartData = useMemo(() => {
    const data = [];
    let totalRevenue = 0;
    let totalCosts = 0;
    let cumulativeProfit = 0;
    let cumulativeTraffic = 0;

    for (let month = 1; month <= forecastMonths; month++) {
      cumulativeTraffic += Number(monthlyTrafficIncrease);
      const monthlyRevenue =
        cumulativeTraffic *
        (Number(conversionRate) / 100) *
        Number(averageOrderValue);
      const monthlyCost = Number(seoCampaignCost) + Number(otherCosts);

      totalRevenue += monthlyRevenue;
      totalCosts += monthlyCost;
      cumulativeProfit = totalRevenue - totalCosts;

      data.push({
        month: `Month ${month}`,
        monthlyRevenue: monthlyRevenue,
        totalCosts: totalCosts,
        profit: cumulativeProfit,
      });
    }

    return { data, totalRevenue, totalCosts, totalProfit: cumulativeProfit };
  }, [
    monthlyTrafficIncrease,
    conversionRate,
    averageOrderValue,
    seoCampaignCost,
    otherCosts,
    forecastMonths,
  ]);

  // Styles
  const containerStyle = {
    // padding: "20px",
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
  };

  const headerStyle = {
    marginBottom: "24px",
  };

  const topSectionStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    // gap: "24px",
    // marginBottom: "24px",
  };

  const inputSectionStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
  };

  const inputStyle = {
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
  };

  const labelStyle = {
    fontSize: "0.9rem",
    color: "#666",
  };

  const disclaimerStyle = {
    fontSize: "0.85rem",
    color: "#666",
    fontStyle: "italic",
    marginTop: "16px",
    gridColumn: "1 / -1",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>SEO Campaign Planning Tool</h1>

      <div style={topSectionStyle}>
        <div style={inputSectionStyle}>
          <InputGroupWithTooltip
            label="Estimated Monthly Traffic Growth"
            id="monthlyTrafficIncrease"
            tooltipText={tooltipTexts.monthlyTrafficIncrease}
          >
            <input
              style={inputStyle}
              type="number"
              id="monthlyTrafficIncrease"
              value={monthlyTrafficIncrease}
              onChange={handleInputChange(setMonthlyTrafficIncrease)}
            />
          </InputGroupWithTooltip>

          <InputGroupWithTooltip
            label="Expected Conversion Rate (%)"
            id="conversionRate"
            tooltipText={tooltipTexts.conversionRate}
          >
            <input
              style={inputStyle}
              type="range"
              min="1"
              max="20"
              id="conversionRate"
              value={conversionRate}
              onChange={handleInputChange(setConversionRate)}
            />
            <span style={labelStyle}>{conversionRate} %</span>
          </InputGroupWithTooltip>

          <InputGroupWithTooltip
            label="Projected Revenue Per Customer"
            id="averageOrderValue"
            tooltipText={tooltipTexts.averageOrderValue}
          >
            <input
              style={inputStyle}
              type="number"
              id="averageOrderValue"
              value={averageOrderValue}
              onChange={handleInputChange(setAverageOrderValue)}
            />
          </InputGroupWithTooltip>

          <InputGroupWithTooltip
            label="Planned Monthly SEO Investment"
            id="seoCampaignCost"
            tooltipText={tooltipTexts.seoCampaignCost}
          >
            <input
              style={inputStyle}
              type="number"
              id="seoCampaignCost"
              value={seoCampaignCost}
              onChange={handleInputChange(setSeoCampaignCost)}
            />
          </InputGroupWithTooltip>

          <InputGroupWithTooltip
            label="Additional Monthly Expenses (Optional)"
            id="otherCosts"
            tooltipText={tooltipTexts.otherCosts}
          >
            <input
              style={inputStyle}
              type="number"
              id="otherCosts"
              value={otherCosts}
              onChange={handleInputChange(setOtherCosts)}
            />
          </InputGroupWithTooltip>

          <InputGroupWithTooltip
            label="Planning Timeline (Months)"
            id="forecastMonths"
            tooltipText={tooltipTexts.forecastMonths}
          >
            <input
              style={inputStyle}
              type="range"
              min="1"
              max="36"
              id="forecastMonths"
              value={forecastMonths}
              onChange={handleInputChange(setForecastMonths)}
            />
            <span style={labelStyle}>{forecastMonths} month</span>
          </InputGroupWithTooltip>

          <InputGroupWithTooltip
            label="Currency"
            id="currency"
            tooltipText={tooltipTexts.currency}
          >
            <select
              style={inputStyle}
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </InputGroupWithTooltip>

          <p style={disclaimerStyle}>
            Note: This tool provides rough estimations based on your inputs.
            Actual results may vary significantly due to market conditions,
            competition, and other external factors.
          </p>
        </div>

        <ProfitLossSummary chartData={chartData} currency={currency} />
      </div>

      <div>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "16px" }}>
          Projected Financial Timeline
        </h2>
        <div style={{ width: "100%", height: "400px" }}>
          <ResponsiveContainer>
            <ComposedChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="monthlyRevenue"
                fill="#8884d8"
                name="Projected Monthly Revenue"
              />
              <Line
                type="monotone"
                dataKey="totalCosts"
                stroke="#82ca9d"
                name="Cumulative Costs"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#ffc658"
                name="Projected Profit"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
