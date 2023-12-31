document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const saveButton = document.getElementById("save-button");
  const lastUpdate = document.getElementById("last-update");
  const activePRComments = document.getElementById("active-pr-comments");
  const activePRTasks = document.getElementById("active-pr-tasks");
  const manualButton = document.getElementById("update-button");
  const testButton = document.getElementById("test-button");
  const notifyCommentsCheckbox = document.getElementById("notify-comments");
  const notifyTasksCheckbox = document.getElementById("notify-tasks");
  const notifyStatusCheckbox = document.getElementById("notify-status");
  const notifyFilterYou = document.getElementById("notify-filter-you");
  const notifyUnreviewedCheckbox = document.getElementById("notify-unreviewed");
  const monitoringFrequencyInput = document.getElementById(
    "monitoring-frequency",
  );
  const notifyCompletionCheckbox = document.getElementById("notify-completion");

  saveButton.addEventListener("click", function () {
    savePrefsToBackEnd(
      monitoringFrequencyInput.value,
      notifyCommentsCheckbox.checked,
      notifyTasksCheckbox.checked,
      notifyStatusCheckbox.checked,
      notifyCompletionCheckbox.checked,
      notifyFilterYou.checked,
      notifyUnreviewedCheckbox.checked,
    ).then(() => {
      console.log("Saved preferences");
    });
  });

  function updateStatistics() {
    getStatsFromBackEnd().then((data) => {
      if (data) {
        lastUpdate.textContent = new Date(
          data.LastUpdate * 1000,
        ).toLocaleString();
        activePRComments.textContent = data.NumberOfActivePrComments;
        activePRTasks.textContent = data.NumberOfActivePrTasks;
      }
    });
  }
  updatePreferences(
    monitoringFrequencyInput,
    notifyCommentsCheckbox,
    notifyTasksCheckbox,
    notifyStatusCheckbox,
    notifyCompletionCheckbox,
    notifyFilterYou,
    notifyUnreviewedCheckbox,
  );

  setInterval(updateStatistics, 30000);

  manualButton.addEventListener("click", function () {
    manualUpdate(lastUpdate, activePRComments, activePRTasks);
  });

  testButton.addEventListener("click", function () {
    sendNotification();
  });
});

function manualUpdate(lastUpdate, activePRComments, activePRTasks) {
  getManualUpdateFromBackEnd().then((data) => {
    if (data) {
      lastUpdate.textContent = new Date(
        data.LastUpdate * 1000,
      ).toLocaleString();
      activePRComments.textContent = data.NumberOfActivePrComments;
      activePRTasks.textContent = data.NumberOfActivePrTasks;
    }
  });
}
function sendNotification() {
  fetch("/send-notification", {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function getManualUpdateFromBackEnd() {
  try {
    const response = await fetch("/update", {
      method: "GET",
    });

    const data = await response.json();

    if (data) {
      return data;
    } else {
      alert("Response was empty, but without error");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

function updatePreferences(
  monitoringFrequencyInput,
  notifyCommentsCheckbox,
  notifyTasksCheckbox,
  notifyStatusCheckbox,
  notifyCompletionCheckbox,
  notifyFilterYou,
  notifyUnreviewedCheckbox,
) {
  getPrefsFromBackEnd().then((data) => {
    monitoringFrequencyInput.value = data?.PollingInterval;
    notifyCommentsCheckbox.checked = data?.Comments;
    notifyTasksCheckbox.checked = data?.Tasks;
    notifyStatusCheckbox.checked = data?.StatusChanges;
    notifyCompletionCheckbox.checked = data?.CompletionTime;
    notifyFilterYou.checked = data?.FilterOwnActivities;
    notifyUnreviewedCheckbox.checked = data?.StickyUnreviewedPRs;
  });
}

async function getPrefsFromBackEnd() {
  try {
    const response = await fetch("/config", {
      method: "GET",
    });

    const data = await response.json();

    if (data) {
      return data;
    } else {
      alert("Response was empty, but without error");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function savePrefsToBackEnd(
  monitoringFrequencyInput,
  notifyCommentsCheckbox,
  notifyTasksCheckbox,
  notifyStatusCheckbox,
  notifyCompletionCheckbox,
  notifyFilterYou,
  notifyUnreviewedCheckbox,
) {
  try {
    await fetch("/config", {
      method: "POST",
      body: JSON.stringify({
        PollingInterval: monitoringFrequencyInput,
        Comments: notifyCommentsCheckbox,
        Tasks: notifyTasksCheckbox,
        StatusChanges: notifyStatusCheckbox,
        CompletionTime: notifyCompletionCheckbox,
        FilterOwnActivities: notifyFilterYou,
        StickyUnreviewedPRs: notifyUnreviewedCheckbox,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function getStatsFromBackEnd() {
  try {
    const response = await fetch("/stats", {
      method: "GET",
    });

    const data = await response.json();

    if (data) {
      return data;
    } else {
      alert("Response was empty, but without error");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
