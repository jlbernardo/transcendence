const btn = document.getElementById("api")
const submitBtn = document.getElementById("submit");
const deleteBtn = document.getElementById("delete");

submitBtn?.addEventListener("click", async (e) => {
  e.preventDefault(); // Prevent form submission

  const nickInput = document.getElementById("nick") as HTMLInputElement;
  const ageInput = document.getElementById("age") as HTMLInputElement;

  const newEntry = {
    nick: nickInput.value,
    age: Number(ageInput.value),
  };

  try {
    const resp = await fetch("http://localhost:3000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEntry),
    });

    if (resp.ok) {
      console.log("New entry added successfully");
    } else {
      console.error("Error adding new entry");
    }
  } catch (err) {
    console.error("Error:", err);
  }
});

deleteBtn?.addEventListener("click", async (e) => {
  e.preventDefault(); // Prevent form submission

  const delNickInput = document.getElementById("del-nick") as HTMLInputElement;

  const deleteEntry = {
    nick: delNickInput.value,
  };

  try {
    const resp = await fetch("http://localhost:3000", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deleteEntry),
    });

    if (resp.ok) {
      console.log("Entry deleted successfully");
    } else {
      console.error("Error deleting entry");
    }
  } catch (err) {
    console.error("Error:", err);
  }
});

btn?.addEventListener("click", async () => {
  try {
    const resp = await fetch("http://localhost:3000");
    const data = await resp.json(); // data is your array

    const container = document.getElementById("rsp")!;
    container.innerHTML = ""; // clear old content

    data.forEach((item: { nick: string; age: number }) => {
      const div = document.createElement("div");
      div.textContent = `Nick: ${item.nick}, Age: ${item.age}`;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching data:", err);
  }
});
