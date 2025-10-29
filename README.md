# Raw Material Inventory Management System

A simple, web-based inventory management system designed for tracking raw materials. This application allows users to manage items, track incoming (inward) stock, and record outgoing (issued) stock.

This project is built with HTML, Bootstrap, and jQuery, and it uses **JsonPowerDB (JPDB)** for real-time, serverless data storage and retrieval.

## 🎥 Project Demo

A short video walkthrough of the project, explaining its features and functionality, can be found here:

➡️ **[[Video Link](https://drive.google.com/file/d/1tynZjAr_MAYsqlgLIcf2cY51MrZ2-1gI/view?usp=sharing)]**

## 📸 Screenshots

Here is the main dashboard of the application:

<br>

<img width="1918" height="964" alt="image" src="https://github.com/user-attachments/assets/d761722b-f724-4e4a-9eea-508fdec6971f" />
<br>
## ✨ Features

The system is divided into four main modules:

* **Item Management:** Create, Update, and navigate through all inventory items. Each item includes an ID, Name, Opening Stock, and Unit of Measurement (UoM).
    <br>
    <img width="1918" height="964" alt="image" src="https://github.com/user-attachments/assets/08c1121e-feb0-4f61-95e0-d0b0f9410186" />

    * **Item Received (Inward):** Log new stock as it arrives. This form automatically updates the "itemsReceived" count for the corresponding item in the database.
    <br>
    <img width="1910" height="963" alt="image" src="https://github.com/user-attachments/assets/aba3edb0-6195-464b-af2f-bfb633bc7bcf" />

    * **Item Issue (Outward):** Record items being issued or used. The system performs a real-time check to ensure that you cannot issue more stock than is currently available.
    <br>
    <img width="1910" height="960" alt="image" src="https://github.com/user-attachments/assets/9f80dfd5-4ab2-4176-b687-4da6b6b22017" />

    * **Item Report:** View a live summary report of all items. The table dynamically calculates the **Current Stock** by subtracting `itemsIssued` from `itemsReceived`.
    <br>
    <img width="1823" height="959" alt="image" src="https://github.com/user-attachments/assets/f1a3ac05-82c6-42b5-8036-339d274a598d" />
    ### Common Functionality

* **Form Navigation:** All management forms include **First**, **Previous**, **Next**, and **Last** record navigation buttons.
* **Data Validation:** All forms include basic validation to ensure no empty fields are submitted.
* **Dynamic UI:** Buttons like "Save", "Update", and "Reset" are dynamically enabled or disabled based on the form's state.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Frameworks/Libraries:**
    * [Bootstrap 5](https://getbootstrap.com/)
    * [jQuery 3.7.1](https://jquery.com/)
    * [Google Fonts (Poppins)](https://fonts.google.com/specimen/Poppins)
* **Database (BaaS):** [JsonPowerDB (JPDB)](http://login2explore.com/)

## 🚀 Getting Started

To run this project locally, simply:

1.  Clone the repository:
    ```sh
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    ```
2.  Open the `index.html` file in your web browser.

> **Note:** An active internet connection is required for the application to connect to the JsonPowerDB database and fetch the Bootstrap, Bootstrap Icons, and Google Fonts.

## 📂 File Structure

Here is the file structure (using the new file names):
├── css/ │ └── style.css ├── js/ │ ├── app.js (Main navigation and page loading) │ ├── jquery-3.7.1.min.js │ ├── product.js (Logic for Item Management) │ ├── receive.js (Logic for Item Received) │ ├── dispatch.js (Logic for Item Issue) │ └── summary.js (Logic for Report) ├── pages/ │ ├── product_management.html │ ├── receive_management.html │ ├── dispatch_management.html │ └── summary_page.html └── index.html (Main application shell)

## 👨‍💻 Author

* **Yash Jain**

* [GitHub Profile](https://github.com/Yashjain246)
* [LinkedIn Profile](www.linkedin.com/in/yashjain246)

## 📄 License

This project is open-source. Feel free to use, modify, and distribute it.

Distributed under the MIT License.
