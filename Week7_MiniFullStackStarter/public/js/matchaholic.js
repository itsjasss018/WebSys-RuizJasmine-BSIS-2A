const userForm = document.getElementById("userForm");
const userList = document.getElementById("userList");

// SHOW MESSAGE
function showMessage(text, type = "success") {
    const message = document.createElement("div");
    message.className = `alert alert-${type} mt-3`;
    message.textContent = text;

    userForm.prepend(message);

    setTimeout(() => {
        message.remove();
    }, 2500);
}

// LOAD ORDERS
async function loadUsers() {
    try {
        const res = await fetch("/api/users");
        const users = await res.json();

        userList.innerHTML = "";

        if (!users.length) {
            userList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🍵</div>
                    <h3>No orders yet</h3>
                    <p>Your recent matcha orders will appear here.</p>
                </div>
            `;
            return;
        }

        users.forEach(u => {
            const item = document.createElement("div");
            item.className = "order-item";

            item.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <div class="order-name">${u.name}</div>

                        <div class="order-details">
                            ${u.email}
                            ${u.age ? " • Age " + u.age : ""}
                        </div>

                        <div class="order-details">
                            ${u.flavor || "Matcha"}
                            • ${u.size || "Regular"}
                            • ×${u.quantity || 1}
                        </div>

                        <span class="order-badge">
                            ${u.orderType || "Order"}
                        </span>
                    </div>

                    <button class="btn btn-sm btn-outline-danger delete-btn">
                        Delete
                    </button>
                </div>
            `;

            item.querySelector(".delete-btn").addEventListener(
                "click",
                async () => {
                    const confirmDelete = confirm("Delete this order?");

                    if (!confirmDelete) return;

                    const res = await fetch(
                        `/api/users/${u._id}`,
                        { method: "DELETE" }
                    );

                    if (res.ok) {
                        showMessage("Order deleted.", "warning");
                        loadUsers();
                    } else {
                        showMessage("Failed to delete order.", "danger");
                    }
                }
            );

            userList.appendChild(item);
        });

    } catch (error) {
        console.error(error);

        userList.innerHTML = `
            <div class="alert alert-danger">
                Failed to load orders.
            </div>
        `;
    }
}

// ADD ORDER
userForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        age: document.getElementById("age").value,
        flavor: document.getElementById("flavor").value,
        size: document.getElementById("size").value,
        quantity: document.getElementById("quantity").value,
        orderType: document.getElementById("orderType").value
    };

    if (payload.age === "") {
        delete payload.age;
    }

    try {
        const res = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
            showMessage(
                data.error || "Failed to place order.",
                "danger"
            );
            return;
        }

        userForm.reset();
        showMessage("Order placed successfully!");
        loadUsers();

    } catch (error) {
        console.error(error);

        showMessage(
            "Something went wrong. Please try again.",
            "danger"
        );
    }
});

// INITIAL LOAD
loadUsers();