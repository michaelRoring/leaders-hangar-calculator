import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Chart from "chart.js/auto";
import Tooltip from "../atoms/Tooltip";
import jsPDF from 'jspdf';


const ABMCalculator = () => {
  const [targetAccounts, setTargetAccounts] = useState(100);
  const [contactsPerAccount, setContactsPerAccount] = useState(3);
  const [outreachCadence, setOutreachCadence] = useState(5);
  const [timeframe, setTimeframe] = useState(12);
  const [contactRate, setContactRate] = useState(20);
  const [responseRate, setResponseRate] = useState(5);
  const [meetingRate, setMeetingRate] = useState(20);
  const [opportunityRate, setOpportunityRate] = useState(30);
  const [closeRate, setCloseRate] = useState(10);
  const [costPerContact, setCostPerContact] = useState(1);
  const [costPerOutreach, setCostPerOutreach] = useState(0.5);
  const [averageDealSize, setAverageDealSize] = useState(5000);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const calculatedValues = useMemo(() => {
    const totalContacts = targetAccounts * contactsPerAccount;
    const totalOutreachMessages = totalContacts * outreachCadence;
    const totalCost =
      totalContacts * costPerContact + totalOutreachMessages * costPerOutreach;
    const dealsClosed =
      totalContacts *
      outreachCadence *
      (contactRate / 100) *
      (responseRate / 100) *
      (meetingRate / 100) *
      (opportunityRate / 100) *
      (closeRate / 100);
    const totalRevenue = dealsClosed * averageDealSize;
    const profit = totalRevenue - totalCost;
    const roi =
      totalCost === 0 ? 0 : ((totalRevenue - totalCost) / totalCost) * 100;

    return {
      totalRevenue,
      totalCost,
      profit,
      dealsClosed,
      roi,
    };
  }, [
    targetAccounts,
    contactsPerAccount,
    outreachCadence,
    contactRate,
    responseRate,
    meetingRate,
    opportunityRate,
    closeRate,
    costPerContact,
    costPerOutreach,
    averageDealSize,
  ]);

  const { totalRevenue, totalCost, profit, dealsClosed, roi } =
    calculatedValues;

    const updateFinancialChart = useCallback(
      (timeframe, totalRevenue, totalCost) => {
        const labels = Array.from(
          { length: timeframe },
          (_, i) => `Month ${i + 1}`
        );
        const monthlyRevenue = totalRevenue / timeframe;
        const monthlyCost = totalCost / timeframe;
        const revenueData = [];
        let cumulativeRevenue = 0;
        for (let i = 0; i < timeframe; i++) {
          cumulativeRevenue += monthlyRevenue;
          revenueData.push(cumulativeRevenue);
        }
        const costData = Array.from({ length: timeframe }, () => monthlyCost);
        const profitData = revenueData.map(
          (revenue, index) => revenue - monthlyCost * (index + 1)
        );
    
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
    
        const ctx = chartRef.current.getContext("2d");
        chartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Cumulative Revenue",
                data: revenueData,
                type: "bar",
                borderColor: "rgb(255, 193, 7)",
                fill: false,
                tension: 0.2,
              },
              {
                label: "Monthly Cost",
                data: costData,
                type: "line", 
                borderColor: "rgb(255, 193, 7)",
                fill: true,
                backgroundColor: "rgba(108, 117, 125, 0.2)",
                tension: 0.2,
              },
              {
                label: "Cumulative Profit",
                data: profitData,
                type: "line", 
                borderColor: "rgb(75, 192, 192)",
                fill: false,
                tension: 0.2,
              },
            ],
          },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      });
    },
    []
  );

  useEffect(() => {
    updateFinancialChart(timeframe, totalRevenue, totalCost);
  }, [timeframe, totalRevenue, totalCost, updateFinancialChart]);

  useEffect(() => {
    setRevenueOutput(totalRevenue.toFixed(2));
    setCostOutput(totalCost.toFixed(2));
    setProfitOutput(profit.toFixed(2));
    setDealsOutput(dealsClosed.toFixed(0));
    setRoiOutput(roi.toFixed(2));
  }, [totalRevenue, totalCost, profit, dealsClosed, roi]);

  const [revenueOutput, setRevenueOutput] = useState(0);
  const [costOutput, setCostOutput] = useState(0);
  const [profitOutput, setProfitOutput] = useState(0);
  const [dealsOutput, setDealsOutput] = useState(0);
  const [roiOutput, setRoiOutput] = useState(0);

  const [currency, setCurrency] = useState("$");

  const currencies = [
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

  const handleDownloadPdf = () => {
    const chartCanvas = chartRef.current;
    const chartDataURL = chartCanvas.toDataURL();
    const pdf = new jsPDF();
  
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text('ABM Campaign Forecasting Tool', 10, 10);
  
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 10, 20);
  
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Target Audience & Reach`, 10, 30);
  
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Target Accounts: ${targetAccounts}`, 15, 40);
    pdf.text(`Contacts per Account: ${contactsPerAccount}`, 15, 50);
  
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Outreach & Engagement`, 10, 65);
  
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Outreach Cadence: ${outreachCadence}`, 15, 75);
    pdf.text(`Timeframe: ${timeframe}`, 15, 85);
    pdf.text(`Contact Rate: ${contactRate}%`, 15, 95);
    pdf.text(`Response Rate: ${responseRate}%`, 15, 105);
    pdf.text(`Meeting Rate: ${meetingRate}%`, 15, 115);
    pdf.text(`Opportunity Rate: ${opportunityRate}%`, 15, 125);
    pdf.text(`Close Rate: ${closeRate}%`, 15, 135);
  
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Time & Cost`, 10, 150);
  
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Cost per Contact: ${currency} ${costPerContact}`, 15, 160);
    pdf.text(`Cost per Outreach: ${currency} ${costPerOutreach}`, 15, 170);
  
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Deal Value`, 10, 190);
  
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Average Deal Size: ${currency} ${averageDealSize}`, 15, 200);
  
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Projected Profit and Loss Summary`, 10, 220);
  
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Total Revenue: ${currency} ${totalRevenue.toFixed(2)}`, 15, 230);
    pdf.text(`Total Cost: ${currency} ${totalCost.toFixed(2)}`, 15, 240);
    pdf.text(`Profit: ${currency} ${profit.toFixed(2)}`, 15, 250);
    pdf.text(`Deals Closed: ${dealsClosed.toFixed(0)}`, 15, 260);
    pdf.text(`ROI: ${roi.toFixed(2)}%`, 15, 270);
  
    pdf.addPage();
    pdf.addImage(chartDataURL, 'PNG', 10, 10, 190, 60);
  
    pdf.save('abm_campaign_forecast.pdf');
  };
  


  return (
    <div className=" mx-auto p-6 w-screen ">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        ABM Campaign Forecasting Tool
      </h1>

      <div className=" w-full">
        {/* Input Section (Left) */}
        <div className="w-full ">
          <div className="flex flex-row gap-4">
            {/* Target Audience & Reach Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-bold mb-2 text-gray-800">
                Target Audience & Reach
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="mb-2">
                  <label
                    htmlFor="targetAccounts"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    <Tooltip
                      text="Target Account List Size"
                      cards={[
                        {
                          title: "Definition",
                          text: "The total number of accounts you are specifically targeting with this ABM campaign.",
                        },
                        {
                          title: "Example",
                          text: 'If you have a list of 100 high-value accounts you want to engage, enter "100".',
                        },
                        {
                          title: "Impact",
                          text: "This directly influences the potential reach and revenue of your campaign. A larger list size means a broader potential audience but might also require more resources.",
                        },
                      ]}
                    />
                  </label>
                  <input
                    type="range"
                    id="targetAccounts"
                    className="w-full"
                    value={targetAccounts}
                    onChange={(e) =>
                      setTargetAccounts(parseInt(e.target.value, 10))
                    }
                    min="0"
                    max="500"
                  />
                  <span className="text-gray-500 text-sm">
                    {targetAccounts}
                  </span>
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="contactsPerAccount"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    <Tooltip
                      text="Number of Contacts per Account"
                      cards={[
                        {
                          title: "Definition",
                          text: "The average number of individual contacts you plan to engage within each target account.",
                        },
                        {
                          title: "Example",
                          text: 'If you aim to connect with 3 key decision-makers within each account, enter "3."',
                        },
                        {
                          title: "Impact",
                          text: "This impacts your outreach efforts and personalization strategy. More contacts per account can increase engagement but also require more tailored messaging.",
                        },
                      ]}
                    />
                  </label>
                  <input
                    type="range"
                    id="contactsPerAccount"
                    className="w-full"
                    value={contactsPerAccount}
                    onChange={(e) =>
                      setContactsPerAccount(parseInt(e.target.value, 10))
                    }
                    min="0"
                    max="10"
                  />
                  <span className="text-gray-500 text-sm">
                    {contactsPerAccount}
                  </span>
                </div>
              </div>
            </div>

            {/* Outreach & Engagement Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-bold mb-2 text-gray-800">
                Outreach & Engagement
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-2">
                  <label
                    htmlFor="outreachCadence"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Outreach Cadence
                  </label>
                  <input
                    type="range"
                    id="outreachCadence"
                    className="w-full"
                    value={outreachCadence}
                    onChange={(e) =>
                      setOutreachCadence(parseInt(e.target.value, 10))
                    }
                    min="0"
                    max="10"
                  />
                  <span className="text-gray-500 text-sm">
                    {outreachCadence}
                  </span>
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="contactRate"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    <Tooltip
                      text="Initial Contact Rate (%)"
                      cards={[
                        {
                          title: "Definition",
                          text: "The percentage of initial outreach attempts that result in a positive response (e.g., email reply, phone call connection).",
                        },
                        {
                          title: "Example",
                          text: 'If you expect a 20% response rate to your initial emails, enter "20."',
                        },
                        {
                          title: "Impact",
                          text: "This reflects the effectiveness of your initial outreach strategy and influences the number of leads moving down the funnel.",
                        },
                      ]}
                    />
                  </label>
                  <input
                    type="range"
                    id="contactRate"
                    className="w-full"
                    value={contactRate}
                    onChange={(e) =>
                      setContactRate(parseInt(e.target.value, 10))
                    }
                    min="0"
                    max="100"
                  />
                  <span className="text-gray-500 text-sm">{contactRate}</span>
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="responseRate"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    <Tooltip
                      text="Response Rate (%)"
                      cards={[
                        {
                          title: "Definition",
                          text: "The percentage of positive responses that lead to further engagement (e.g., scheduling a meeting, requesting a demo).",
                        },
                        {
                          title: "Example",
                          text: 'If 20% of those who responded to your initial outreach agree to a meeting, enter "20."',
                        },
                        {
                          title: "Impact",
                          text: "This shows the quality of your engagement and how well you nurture leads towards conversion.",
                        },
                      ]}
                    />
                  </label>
                  <input
                    type="range"
                    id="responseRate"
                    className="w-full"
                    value={responseRate}
                    onChange={(e) =>
                      setResponseRate(parseInt(e.target.value, 10))
                    }
                    min="0"
                    max="100"
                  />
                  <span className="text-gray-500 text-sm">{responseRate}</span>
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="meetingRate"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    <Tooltip
                      text="Meeting Booked Rate (%)"
                      cards={[
                        {
                          title: "Definition",
                          text: "The percentage of engaged leads that result in a booked meeting or sales call.",
                        },
                        {
                          title: "Example",
                          text: 'If 30% of the engaged leads schedule a meeting, enter "30."',
                        },
                        {
                          title: "Impact",
                          text: "This indicates the effectiveness of your lead qualification and meeting scheduling process.",
                        },
                      ]}
                    />
                  </label>
                  <input
                    type="range"
                    id="meetingRate"
                    className="w-full"
                    value={meetingRate}
                    onChange={(e) =>
                      setMeetingRate(parseInt(e.target.value, 10))
                    }
                    min="0"
                    max="100"
                  />
                  <span className="text-gray-500 text-sm">{meetingRate}</span>
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="opportunityRate"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    <Tooltip
                      text="Opportunity Creation Rate (%)"
                      cards={[
                        {
                          title: "Definition",
                          text: "The percentage of meetings that result in a qualified sales opportunity.",
                        },
                        {
                          title: "Example",
                          text: 'If 40% of your meetings lead to a qualified opportunity, enter "40."',
                        },
                        {
                          title: "Impact",
                          text: "This reflects the quality of your sales interactions and your ability to identify genuine opportunities.",
                        },
                      ]}
                    />
                  </label>
                  <input
                    type="range"
                    id="opportunityRate"
                    className="w-full"
                    value={opportunityRate}
                    onChange={(e) =>
                      setOpportunityRate(parseInt(e.target.value, 10))
                    }
                    min="0"
                    max="100"
                  />
                  <span className="text-gray-500 text-sm">
                    {opportunityRate}
                  </span>
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="closeRate"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    <Tooltip
                      text="Close Rate (%)"
                      cards={[
                        {
                          title: "Definition",
                          text: "The percentage of qualified opportunities that convert into closed deals or sales.",
                        },
                        {
                          title: "Example",
                          text: ' If you close 10% of your qualified opportunities, enter "10."',
                        },
                        {
                          title: "Impact",
                          text: "This is a crucial metric that directly impacts your revenue and ROI.",
                        },
                      ]}
                    />
                  </label>
                  <input
                    type="range"
                    id="closeRate"
                    className="w-full"
                    value={closeRate}
                    onChange={(e) => setCloseRate(parseInt(e.target.value, 10))}
                    min="0"
                    max="100"
                  />
                  <span className="text-gray-500 text-sm">{closeRate}</span>
                </div>
              </div>
            </div>

            {/* Time & Cost Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-bold mb-2 text-gray-800">
                Time & Cost
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-2">
                  <label
                    htmlFor="timeframe"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    <Tooltip
                      text="Timeframe (Months)"
                      cards={[
                        {
                          title: "Definition",
                          text: "The total duration of your ABM campaign in months.",
                        },
                        {
                          title: "Example",
                          text: `If you're planning a 12-month campaign, enter "12."`,
                        },
                        {
                          title: "Impact",
                          text: "This sets the timeframe for your projections and allows you to assess long-term performance.",
                        },
                      ]}
                    />
                  </label>
                  <select
                    id="timeframe"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={timeframe}
                    onChange={(e) => setTimeframe(parseInt(e.target.value, 10))}
                  >
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="costPerContact"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    <Tooltip
                      text="Cost per Contact"
                      cards={[
                        {
                          title: "Definition",
                          text: "The average cost associated with each individual contact attempt (e.g., email, call, social media interaction).",
                        },
                        {
                          title: "Example",
                          text: `If each email costs $0.05 to send, enter "0.05."`,
                        },
                        {
                          title: "Impact",
                          text: "This contributes to your overall campaign costs and influences your ROI calculation.",
                        },
                      ]}
                    />
                  </label>
                  <input
                    type="number"
                    id="costPerContact"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={costPerContact}
                    onChange={(e) =>
                      setCostPerContact(parseFloat(e.target.value))
                    }
                    min="0"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="costPerOutreach"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    <Tooltip
                      text="Cost per Outreach"
                      cards={[
                        {
                          title: "Definition",
                          text: "The average cost associated with each outreach attempt to a target account, regardless of the number of contacts within that account.",
                        },
                        {
                          title: "Example",
                          text: `If a personalized direct mail piece to an account costs $5, enter "5."`,
                        },
                        {
                          title: "Impact",
                          text: "This reflects the cost of broader outreach efforts and contributes to your overall campaign expenses.",
                        },
                      ]}
                    />
                  </label>
                  <input
                    type="number"
                    id="costPerOutreach"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={costPerOutreach}
                    onChange={(e) =>
                      setCostPerOutreach(parseFloat(e.target.value))
                    }
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Deal Value Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-bold mb-2 text-gray-800">
                Deal Value
              </h2>
              <div className="mb-2">
                <label
                  htmlFor="averageDealSize"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  <Tooltip
                      text="Average Deal Size"
                      cards={[
                        {
                          title: "Definition",
                          text: "The average revenue generated from closing a deal with a target account.",
                        },
                        {
                          title: "Example",
                          text: `If your average deal size is $20,000, enter "20000."`,
                        },
                        {
                          title: "Impact",
                          text: "This is a critical driver of your revenue projections and ROI calculation.",
                        },
                      ]}
                    />
                </label>
                <input
                  type="number"
                  id="averageDealSize"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={averageDealSize}
                  onChange={(e) =>
                    setAverageDealSize(parseFloat(e.target.value))
                  }
                  min="0"
                />
              </div>
            </div>
            <div>
            <div>
      {/* ... (rest of your code) */}
      <button onClick={handleDownloadPdf}>Download PDF</button>
    </div>
              <div className="mb-2">
                <label
                  htmlFor="currency"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Currency
                </label>
                <select
                  id="currency"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {currencies.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-blue-800 text-white p-2 rounded-t-lg">
                  <h2 className="text-xl font-bold text-center">
                    Projected Profit and Loss Summary
                  </h2>
                </div>
                <div className="p-2">
                  <div className="flex justify-between mb-2">
                    <div className="text-lg font-semibold">Revenue</div>
                    <div id="revenueOutput" className="text-lg font-bold">
                      {currency} {revenueOutput}
                    </div>
                  </div>
                  <div className="flex justify-between mb-2">
                    <div className="text-lg font-semibold">Costs</div>
                    <div id="costOutput" className="text-lg font-bold">
                      {currency} {costOutput}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-lg font-semibold">Profit</div>
                    <div id="profitOutput" className="text-lg font-bold">
                      {currency} {profitOutput}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="text-lg font-semibold">Deals Closed</div>
                    <div id="dealsOutput" className="text-lg font-bold">
                      {dealsOutput}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="text-lg font-semibold">ROI</div>
                    <div id="roiOutput" className="text-lg font-bold">
                      {roiOutput}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary and Chart Section (Right) */}
        <div className="w-full mt-20">
          {/* <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-blue-800 text-white p-2 rounded-t-lg">
              <h2 className="text-xl font-bold text-center">
                Projected Profit and Loss Summary
              </h2>
            </div>
            <div className="p-2">
              <div className="flex justify-between mb-2">
                <div className="text-lg font-semibold">Revenue</div>
                <div id="revenueOutput" className="text-lg font-bold">
                  ${revenueOutput}
                </div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="text-lg font-semibold">Costs</div>
                <div id="costOutput" className="text-lg font-bold">
                  ${costOutput}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-lg font-semibold">Profit</div>
                <div id="profitOutput" className="text-lg font-bold">
                  ${profitOutput}
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <div className="text-lg font-semibold">Deals Closed</div>
                <div id="dealsOutput" className="text-lg font-bold">
                  {dealsOutput}
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <div className="text-lg font-semibold">ROI</div>
                <div id="roiOutput" className="text-lg font-bold">
                  {roiOutput}%
                </div>
              </div>
            </div>
          </div> */}

          <div className="bg-white p-6 rounded-lg shadow-2xl border-black">
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              Projected Financial Timeline
            </h2>
            <div style={{ height: "300px" }}>
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ABMCalculator;
