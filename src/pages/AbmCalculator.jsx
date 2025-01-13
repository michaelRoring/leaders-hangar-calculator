import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Tooltip from "../components/tooltip.svg";
import Chart from "chart.js/auto";

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
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Cumulative Revenue",
              data: revenueData,
              borderColor: "rgb(255, 193, 7)",
              fill: false,
              tension: 0.2,
            },
            {
              label: "Monthly Cost",
              data: costData,
              borderColor: "rgb(108, 117, 125)",
              fill: true,
              backgroundColor: "rgba(108, 117, 125, 0.2)",
              tension: 0.2,
            },
            {
              label: "Cumulative Profit",
              data: profitData,
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
                    Target Account List Size
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
                    Number of Contacts per Account
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
                    Initial Contact Rate (%)
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
                    Response Rate (%)
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
                    Meeting Booked Rate (%)
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
                    Opportunity Creation Rate (%)
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
                    Close Rate (%)
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
                    Timeframe (Months)
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
                    Cost per Contact
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
                    Cost per Outreach
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
                  Average Deal Size
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
