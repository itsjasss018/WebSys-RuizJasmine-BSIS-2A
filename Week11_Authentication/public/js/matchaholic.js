// ==========================================
// MATCHAHOLIC - MATCHA ORDER MANAGEMENT
// ==========================================

const userForm = document.getElementById("userForm");
const userList = document.getElementById("userList");

const flavorSelect = document.getElementById("flavor");
const sizeSelect = document.getElementById("size");
const quantityInput = document.getElementById("quantity");
const priceInput = document.getElementById("price");
const totalPriceInput = document.getElementById("totalPrice");

let products = [];
let selectedProduct = null;


// ==========================================
// FORMAT PRICE
// ==========================================

function formatPrice(amount) {
    const number = Number(amount);

    if (!Number.isFinite(number)) {
        return "Price unavailable";
    }

    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP"
    }).format(number);
}


// ==========================================
// SHOW MESSAGE
// ==========================================

function showMessage(text, type = "success") {
    const message = document.createElement("div");

    message.className = `alert alert-${type} mt-3`;
    message.textContent = text;

    userForm.prepend(message);

    setTimeout(() => {
        message.remove();
    }, 2500);
}


// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadProducts() {
    try {
        const res = await fetch("/api/products");

        if (!res.ok) {
            throw new Error(`Products request failed: ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid products response.");
        }

        products = data;

        flavorSelect.innerHTML = `
            <option value="" selected disabled>
                Choose a matcha flavor
            </option>
        `;

        products.forEach(product => {
            const option = document.createElement("option");

            option.value = product._id;
            option.textContent = product.name;

            flavorSelect.appendChild(option);
        });

        sizeSelect.innerHTML = `
            <option value="" selected disabled>
                Choose a flavor first
            </option>
        `;

        updatePrices();

    } catch (error) {
        console.error("Product loading error:", error);

        flavorSelect.innerHTML = `
            <option value="" selected disabled>
                Failed to load flavors
            </option>
        `;

        showMessage(
            "Could not load matcha products.",
            "danger"
        );
    }
}


// ==========================================
// LOAD SIZES FOR SELECTED FLAVOR
// ==========================================

function loadSizes() {
    const productId = flavorSelect.value;

    selectedProduct = products.find(
        product => product._id === productId
    ) || null;

    sizeSelect.innerHTML = `
        <option value="" selected disabled>
            Choose a size
        </option>
    `;

    if (!selectedProduct) {
        updatePrices();
        return;
    }

    (selectedProduct.sizes || []).forEach(size => {
        const option = document.createElement("option");

        option.value = size.name;
        option.textContent =
            `${size.name} (${size.fluidOunces} oz)`;

        sizeSelect.appendChild(option);
    });

    updatePrices();
}


// ==========================================
// GET SELECTED SIZE
// ==========================================

function getSelectedSize() {
    if (!selectedProduct) {
        return null;
    }

    return (selectedProduct.sizes || []).find(
        size => size.name === sizeSelect.value
    ) || null;
}


// ==========================================
// CALCULATE UNIT PRICE
// ==========================================

function calculateUnitPrice(product, size) {
    return Number(product.price) +
        Number(size.priceAdjustment || 0);
}


// ==========================================
// UPDATE FORM PRICES
// ==========================================

function updatePrices() {
    const size = getSelectedSize();

    const quantity = Math.max(
        1,
        Number(quantityInput.value) || 1
    );

    if (!selectedProduct || !size) {
        priceInput.value = "Select a flavor and size";
        totalPriceInput.value = formatPrice(0);
        return;
    }

    const unitPrice = calculateUnitPrice(
        selectedProduct,
        size
    );

    priceInput.value = formatPrice(unitPrice);

    totalPriceInput.value =
        formatPrice(unitPrice * quantity);
}


// ==========================================
// LOAD RECENT ORDERS
// ==========================================

async function loadUsers() {
    try {
        const res = await fetch("/api/orders");

        if (!res.ok) {
            throw new Error(
                `Orders request failed: ${res.status}`
            );
        }

        const orders = await res.json();

        console.log("Recent Orders:", orders);

        if (!Array.isArray(orders)) {
            throw new Error("Invalid orders response.");
        }

        userList.innerHTML = "";

        // NO ORDERS
        if (orders.length === 0) {
            userList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🍵</div>

                    <h3>No orders yet</h3>

                    <p>
                        Your recent matcha orders
                        will appear here.
                    </p>
                </div>
            `;

            return;
        }


        // DISPLAY ORDERS
        orders.forEach(order => {

            const item = document.createElement("div");

            item.className = "order-item";


            // ORDER DETAILS
            const details = document.createElement("div");

            details.innerHTML = `
                <div class="order-name"></div>

                <div class="order-details"></div>

                <div class="order-details"></div>

                <div class="order-details"></div>

                <div class="order-details"></div>

                <span class="order-badge"></span>
            `;


            // CUSTOMER
            const customer = order.user || {};

            console.log("CUSTOMER DATA:", customer);
            console.log("ORDER TYPE:", customer.orderType);

            details.querySelector(
                ".order-name"
            ).textContent =
                customer.name || "Customer";


            const orderDetails =
                details.querySelectorAll(
                    ".order-details"
                );


            // EMAIL
            orderDetails[0].textContent =
                customer.email ||
                "No email available";


            // PRODUCT DETAILS
            const productDetails =
                (order.products || []).map(
                    productItem => {

                        const productName =
                            productItem.product?.name ||
                            "Unknown Product";

                        const size =
                            productItem.size ||
                            "Regular";

                        const quantity =
                            productItem.quantity ?? 1;

                        return `${productName} • ${size} • ×${quantity}`;
                    }
                );


            orderDetails[1].textContent =
                productDetails.join(", ") ||
                "No products";


            // ORDER ID
            orderDetails[2].textContent =
                `Order ID: ${order._id}`;


            // TOTAL PRICE
            orderDetails[3].textContent =
                order.totalAmount != null
                    ? `Total Price: ${formatPrice(order.totalAmount)}`
                    : "Total Price: N/A";


            // BADGE
            details.querySelector(
                ".order-badge"
          ).textContent = order.orderType || "Order";


            // ==========================================
            // ORDER ROW
            // ==========================================

            const row = document.createElement("div");

            row.className =
                "d-flex justify-content-between align-items-start gap-3";

            row.appendChild(details);


            // ==========================================
            // DELETE BUTTON
            // ==========================================

            const deleteButton =
                document.createElement("button");

            deleteButton.type = "button";

            deleteButton.className =
                "btn btn-outline-danger btn-sm";

            deleteButton.textContent = "Delete";


            deleteButton.addEventListener(
                "click",
                async () => {

                    const confirmed =
                        window.confirm(
                            "Are you sure you want to delete this order?"
                        );

                    if (!confirmed) {
                        return;
                    }


                    // Disable button while deleting
                    deleteButton.disabled = true;

                    deleteButton.textContent =
                        "Deleting...";


                    try {

                        console.log(
                            "DELETE ORDER:",
                            order._id
                        );


                        // SEND DELETE REQUEST
                        const deleteRes =
                            await fetch(
                                `/api/orders/${order._id}`,
                                {
                                    method: "DELETE"
                                }
                            );


                        // READ RESPONSE
                        const deleteData =
                            await deleteRes.json();


                        console.log(
                            "DELETE RESPONSE:",
                            deleteData
                        );


                        // CHECK RESPONSE
                        if (!deleteRes.ok) {

                            throw new Error(
                                deleteData.error ||
                                "Failed to delete order."
                            );
                        }


                        // SUCCESS LOG
                        console.log(
                            "ORDER DELETED:",
                            order._id
                        );


                        // REFRESH RECENT ORDERS
                        await loadUsers();


                        // SHOW SUCCESS MESSAGE
                        showMessage(
                            "Order deleted successfully!"
                        );


                    } catch (error) {

                        console.error(
                            "Delete order error:",
                            error
                        );


                        showMessage(
                            error.message ||
                            "Could not delete order.",
                            "danger"
                        );


                        // Restore button
                        deleteButton.disabled = false;

                        deleteButton.textContent =
                            "Delete";
                    }
                }
            );


            row.appendChild(deleteButton);

            item.appendChild(row);

            userList.appendChild(item);
        });


    } catch (error) {

        console.error(
            "Recent orders loading error:",
            error
        );


        userList.innerHTML = `
            <div class="alert alert-danger">
                Failed to load orders.
                Please check the console.
            </div>
        `;
    }
}


// ==========================================
// UPDATE PRICES WHEN SELECTION CHANGES
// ==========================================

flavorSelect.addEventListener(
    "change",
    loadSizes
);

sizeSelect.addEventListener(
    "change",
    updatePrices
);

quantityInput.addEventListener(
    "input",
    updatePrices
);


// ==========================================
// PLACE ORDER
// ==========================================

userForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        // GET SELECTED SIZE
        const size = getSelectedSize();


        // CHECK FLAVOR AND SIZE
        if (!selectedProduct || !size) {

            showMessage(
                "Please choose a flavor and size.",
                "danger"
            );

            return;
        }


        // GET QUANTITY
        const quantity =
            Number(quantityInput.value);


        // CHECK QUANTITY
        if (
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {

            showMessage(
                "Please enter a valid quantity.",
                "danger"
            );

            return;
        }


        // CALCULATE PRICE
        const unitPrice =
            calculateUnitPrice(
                selectedProduct,
                size
            );

        const totalPrice =
            unitPrice * quantity;


        // GET EMAIL
        const email =
            document.getElementById(
                "email"
            ).value.trim();


        // CUSTOMER PAYLOAD
        const payload = {

            name:
                document.getElementById(
                    "name"
                ).value.trim(),

            email,

            age:
                document.getElementById(
                    "age"
                ).value,

            flavor:
                selectedProduct.name,

            size:
                size.name,

            quantity,

            orderType:
                document.getElementById(
                    "orderType"
                ).value,

            unitPrice,

            totalPrice
        };


        // AGE IS OPTIONAL
        if (payload.age === "") {

            delete payload.age;

        } else {

            payload.age =
                Number(payload.age);
        }


        try {

            // ==========================================
            // STEP 1: FIND CUSTOMER BY EMAIL
            // ==========================================

            const usersRes =
                await fetch(
                    `/api/users?email=${encodeURIComponent(email)}`
                );


            const usersData =
                await usersRes.json();


            if (!usersRes.ok) {

                showMessage(
                    usersData.error ||
                    "Failed to find customer.",
                    "danger"
                );

                return;
            }


            let userData =
                Array.isArray(usersData)
                    ? usersData.find(
                        user =>
                            user.email?.toLowerCase() ===
                            email.toLowerCase()
                    )
                    : null;


            // ==========================================
            // STEP 2: CREATE CUSTOMER IF NOT FOUND
            // ==========================================

            if (!userData) {

                const userRes =
                    await fetch(
                        "/api/users",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    payload
                                )
                        }
                    );


                userData =
                    await userRes.json();


                if (!userRes.ok) {

                    showMessage(
                        userData.error ||
                        "Failed to save customer.",
                        "danger"
                    );

                    return;
                }
            }


            // ==========================================
            // STEP 3: CREATE ORDER
            // ==========================================

            const orderPayload = {

                userId:
                    userData._id,

                productId:
                    selectedProduct._id,

                size:
                    size.name,

                quantity,

                orderType:
                document.getElementById(
                 "orderType"
        ).value
            };

            console.log("ORDER PAYLOAD BEING SENT:", orderPayload);

            const orderRes =
                await fetch(
                    "/api/orders",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                orderPayload
                            )
                    }
                );


            const orderData =
                await orderRes.json();


            if (!orderRes.ok) {

                console.error(
                    "Order creation failed:",
                    orderData
                );

                showMessage(
                    orderData.error ||
                    "Failed to create order.",
                    "danger"
                );

                return;
            }


            console.log(
                "ORDER RESPONSE:",
                orderData
            );


            // ==========================================
            // STEP 4: RESET FORM
            // ==========================================

            userForm.reset();

            selectedProduct = null;


            sizeSelect.innerHTML = `
                <option value="" selected disabled>
                    Choose a flavor first
                </option>
            `;


            updatePrices();


            // ==========================================
            // STEP 5: REFRESH ORDERS
            // ==========================================

            await loadUsers();


            // SUCCESS MESSAGE
            showMessage(
                "Order placed successfully!"
            );
        }


        // ==========================================
        // ORDER SUBMISSION ERROR
        // ==========================================

        catch (error) {

            console.error(
                "Order submission error:",
                error
            );


            showMessage(
                "Something went wrong. Please try again.",
                "danger"
            );
        }
    }
);


// ==========================================
// INITIAL LOAD
// ==========================================

loadProducts();

loadUsers();