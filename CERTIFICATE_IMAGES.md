# Certificate Images Setup

## 📋 Required Certificate Images

To make all certification cards clickable, you need to add these image files to the `images/` folder:

### 🎯 **Certificate Image Files Needed:**

1. **images/certificate.pdf** - Introduction to Management Consulting (Emory University)
2. **images/McKinseyForward.pdf** - McKinsey.org Forward Program
3. **images/gcp-certificate.jpg** - Google Cloud Professional Developer
4. **images/product-mgmt-certificate.jpg** - Product Management Certificate (Coursera)
5. **images/cism-certificate.jpg** - Certified Information Security Manager (CISM)
6. **images/data-science-certificate.jpg** - Data Science Professional Certificate (IBM)

## 📁 **How to Add Your Certificates:**

1. **Save your certificate files** in the `images/` folder (created for you)
2. **Name them exactly** as listed above
3. **Supported formats**: .jpg, .jpeg, .png, .webp, .pdf
4. **For images**: Recommended size 800x600px or larger for good quality
5. **For PDFs**: Will be displayed in a scrollable iframe

## 🔧 **Alternative: Custom Filenames**

If you want to use different filenames, update the `data-certificate` attribute in the HTML:

```html
<!-- Example: Change from images/certificate.jpg to images/my-cert.jpg -->
<div class="cert-card clickable-cert" data-certificate="images/my-cert.jpg">
```

## ✨ **Features:**

- **Click any certificate card** to view the full image or PDF
- **PDF Support** - PDFs are displayed in a scrollable iframe
- **Image Support** - Images are displayed with full zoom capability
- **Responsive modal** that works on all devices
- **Smooth animations** and hover effects
- **Multiple ways to close**: Click X, click outside, or press Escape
- **Dark/Light theme support**

## 🎨 **Tips:**

- Use high-quality images for best results
- Keep file sizes reasonable (under 2MB each)
- Consider using WebP format for better compression
- Test on mobile devices to ensure readability

---

**All certification cards are now clickable!** 🎉
