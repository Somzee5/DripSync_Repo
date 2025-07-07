<!-- Logo -->
<p align="center">
  <img src="./Images/Logo_Dripsync_final.png" alt="DripSync Logo" width="300"/>
</p>

# 🧥 DripSync - Personalized Outfit Recommendation Platform

> "Try it before you buy it" → Smart virtual try-ons and outfit recommendations
> Designed to enhance fashion e-commerce experiences by recommending outfits that align the best with the user's physical traits & preferences.

---

## 🔍 About the Project

**DripSync** is an AI-based fashion recommendation platform that helps users virtually try on outfits and receive clothing suggestions based on their physical attributes such as skin tone, height, weight, and body type.

Unlike traditional fashion e-commerce platforms that mostly rely on content-based filtering (based on wishlists or recent searches), DripSync goes a step further by incorporating visual and physical cues to make more meaningful and accurate recommendations

It aims to bridge the gap between **personal styling** and **e-commerce platforms**, making the online shopping experience more **interactive**, **personalized**, and **confident** for users.

---

## 👨🏻‍💻 Tech Stack Used

| 🔧 Layer             | ⚙️ Technologies Used |
|----------------------|-------------------------|
| 🎨 **Frontend**       | ⚛️ React.js, Tailwind CSS |
| 🐍 **Backend**        | Django Framework, 🌐 REST APIs |
| 🧠 **ML / Computer Vision** | 🐍 Python, 👁️ OpenCV, 👕 cloth-segmentation |
| 🗄️ **Database**        | SQLite3 (for development), Django ORM |
| 📂 **Product Dataset**        | Ajio fashion datasets from Kaggle containing product images, categories, colors, and URLs |
| 🛠️ **Tools & Utilities** | 📬 Postman, 🐙 GitHub, 💻 VS Code |

---

## ✨ Features

- 👤 **User Registration with Physical Details:** Height, weight, body type, and custom skin tone palette
- 📸 **Profile Image Upload:** Used for performing virtual try-ons with OpenCV
- 🎨 **Skin Tone Matching:** Users select from 6 predefined skin-tone palettes to guide color suitability

- 📂 **Two-Stage Outfit Filtering System:**
  - 🧍 **Step 1: Body-Type Based Filtering:**  
    Based on the user’s input height, weight, and measurements, the system estimates their body shape (e.g., pear, inverted triangle, rectangle, etc.) using a BMI-like logic and filters out unsuitable categories.
  - 🌈 **Step 2: Skin Tone-Based Filtering:**  
    Once a category is selected, only the outfits with colors aligning well with the user’s undertone are recommended, enhancing personal appeal 👨🏻‍🦱👨🏽‍🦱👨🏾‍🦱👨🏿‍🦱

- 👕 **Smart Outfit Recommendations:** Final list of products is curated using physical matching instead of just user search/wishlist
- 🧥 **Virtual Try-On Feature:** Garments are realistically overlayed onto the user’s profile image using pose estimation and cloth-segmentation via OpenCV

- 📦 **Wardrobe :**  Users can save preferred outfits and directly proceed to the product on Ajio for purchase


- 🔒 **User Auth & Styling History:** (Optional) Secure login to maintain profile and outfit history

---
## 📸 Project Demo

### 1️⃣ Virtual Try-On:

<div align="center">
  <table>
    <tr>
      <td align="center"><b>User Image</b></td>
      <td></td>
      <td align="center"><b>Product Image</b></td>
      <td></td>
      <td align="center"><b>Virtual Try-On Result</b></td>
    </tr>
    <tr>
      <td><img src="Images/swan.jpg" width="250"/></td>
      <td><img src="https://arrow.apache.org/img/arrow-logo_chevrons_white-txt_black-bg.png" width="40"/></td>
      <td><img src="Images/product.png" width="250"/></td>
      <td><img src="https://arrow.apache.org/img/arrow-logo_chevrons_white-txt_black-bg.png" width="40"/></td>
      <td><img src="Images/tryon_result.jpg" width="250"/></td>
    </tr>
  </table>
</div>

---



