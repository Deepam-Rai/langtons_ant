
let barChartInstances = {};

export function drawBar(canvasName, data, title, barColor = "blue") {
    const ctx = canvasName;
    const xValues = Array.from({ length: data.length }, (_, i) => i);
    const yValues = data;

    if (barChartInstances[canvasName]) {
        let barChartInstance = barChartInstances[canvasName];
        // Update existing chart
        barChartInstance.data.labels = xValues;
        barChartInstance.data.datasets[0].data = yValues;
        barChartInstance.update();
    } else {
        // Create chart first time
        barChartInstances[canvasName] = new Chart(ctx, {
            type: "bar",
            data: {
                labels: xValues,
                datasets: [{
                    backgroundColor: barColor,
                    data: yValues
                }]
            },
            options: {
                responsive: true,
                animation: false, // Disable animation for real-time updates
                legend: { display: false },
                title: {
                    display: true,
                    text: title
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    pieLabels: false,
                    datalabels: {
                        color: 'white',
                        font: {
                          size: 14
                        },
                    }
                }
            }
        });
    }
}

const pieChartInstances = {};



Chart.plugins.register({
    id: "pieLabels",
    beforeDraw: function(chart) {
        const { width, height, ctx } = chart.chart;
        ctx.save(); // Use save first (not restore)
        ctx.textBaseline = "middle";
        ctx.textAlign = "center"; // Key for true horizontal centering
        ctx.fillStyle = "#000";
        ctx.font = (height / 25) + "px sans-serif";

        const data = chart.data.datasets[0].data;
        const total = data.reduce((sum, val) => sum + val, 0);
        const passPercent = (data[0] / total * 100).toFixed(1);
        const failPercent = (data[1] / total * 100).toFixed(1);

        const centerX = width / 2;
        const centerY = height / 1.7;

        ctx.fillText(`Pass: ${passPercent}%`, centerX, centerY - 10);
        ctx.fillText(`Fail: ${failPercent}%`, centerX, centerY + 10);

        ctx.restore(); // Restore at the end
    }
});



export function drawDoughnut(canvasName, pass, fail, title) {
  const xValues = ["Pass", "Fail"];
  const yValues = [pass, fail];
  const barColors = ["#2b5797", "#b91d47"];

  if (pieChartInstances[canvasName]) {
    let pieChartInstance = pieChartInstances[canvasName];
    pieChartInstance.data.datasets[0].data = yValues;
    pieChartInstance.update();
  } else {
    pieChartInstances[canvasName] = new Chart(canvasName, {
      type: "doughnut",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: title
        },
        tooltips: {
          enabled: false
        },
        plugins: {
          datalabels: {
            display: false
          }
        }
      }
    });
  }
}

