(function () {
  console.log("pg1 product grid");

  const CONFIG = window.ShopifyThemeSettings;
  console.log(CONFIG);
})();

// // Phase 4: javascipt goes above
//   // IFFE
//   (function () {
//     // 7.1
//     // 1. Read config

//     const CONFIG = JSON.parse(document.getElementById('pg1-data-{{ sid }}').textContent);

//     const SID = CONFIG.sectionId;

//     // -- 2. DOM. refs ( ALL through root -- never through document )

//     const root = document.getElementById('pg1-' + SID);
//     const gridEl = root.querySelector('[data-pg1-product-grid]');
//     const filterGroup = root.querySelector('[data-pg1-filter-group]');
//     const sortSelect = root.querySelector('[data-pg1-sort-select]');
//     const resultCount = root.querySelector('[data-pg1-results-count]');
//     const paginateEl = root.querySelector('[data-pg1-pagination]');
//     const toastEl = document.getElementById('spg-toast-' + SID);

//     // 7.2 Define State
//     // -- 3. State
//     let activeFilter = '__all';
//     let activeSort = 'featured';
//     let currentPage = 1;
//     let wishlisted = new Set();
//     let cardVariants = {}; // { productId: variantIndex}
//     let cardSlides = {}; // { productId: slideIndex }
//     let toastTimer = null;

//     // 7.3 Build in-memory product list
//     // 4. In-memory data --
//     const allProducts = [];
//     const seenIds = new Set();

//     CONFIG.collections.forEach((col) => {
//       col.products.forEach((p) => {
//         if (!seenIds.has(p.id)) {
//           seenIds.add(p.id);
//           allProducts.push(p);
//         }
//       });
//     });

//     //console.log(allProducts)

//     // 7.4 Write helpers
//     // -- 5. Helpers --
//     function formatMoney(cents) {
//       return '$' + (cents / 100).toFixed(2);
//     }

//     function starsHTML(rating) {
//       return Array.from(
//         { length: 5 },
//         (_, i) =>
//           `<svg viewBox="0 0 12 12" fill="${i < Math.round(rating) ? '#FBBC04' : '#ddd'}">
//         <path d="M6 1l1.39 2.82 3.11.45-2.25 2.19.53 3.1L6 8 3.22 9.56l.53-3.1L1.5 4.27l3.11-.45z"/>
//       </svg>`
//       ).join('');
//     }

//     // 7.5 Write the data pipeline

//     // -- 6 Data Pipeline

//     function getProductList() {
//       let list;

//       if (activeFilter === '__all') {
//         list = [...allProducts];
//       } else {
//         list = allProducts.filter((p) => p.collectionHandle === activeFilter);
//       }

//       switch (activeSort) {
//         case 'price-asceding':
//           list.sort((a, b) => a.price - b.price);
//           break;
//         case 'price-descending':
//           list.sort((a, b) => b.price - a.price);
//           break;
//         case 'created-descending':
//           list.reverse();
//           break;
//       }
//       return list;
//     }

//     function getPagedList(list) {
//       if (!CONFIG.enablePagination) return list;
//       const start = (currentPage - 1) * CONFIG.productsPerPage;
//       return list.slice(start, start + CONFIG.productsPerPage);
//     }

//     // console.log("get-product-list:--",  getProductList());
//     // console.log("getPagedList:",getPagedList(getProductList()))

//     // 7.6. Card Builder
//     // -- 7 Card Builder
//     function buildCardHTML(product) {
//       // 7a. Resolve active variant
//       const varIdx = cardVariants[product.id] ?? 0; // set as empty object
//       const variant = product.variants[varIdx] || product.variants[0];
//       const price = variant ? variant.price : product.price;
//       const compareAt = variant ? variant.compareAtPrice : product.compareAtPrice;
//       const isAvailable = variant ? variant.available : product.available;
//       const isSale = compareAt && compareAt > price;

//       // 7b. Images
//       const images = product.images.length ? product.image : [product.featuredImage];

//       const slideIdx = cardSlides[product.id] || 0;

//       // 7c. Build each part as its own variable

//       const badgeHTML = buildBadgeHTML(product, variant, isAvailable, isSale);
//       const slidesHTML = buildSlidesHTML(images, product);
//       const arrowsHTML = buildArrowsHTML(images, slideIdx);
//       const optionsHTML = buildOptionsHTML(product, variant);
//       const priceHTML = buildPriceHTML(price, compareAt, isSale);
//       const wishlistHTML = CONFIG.showWishlist ? `<button class="spg-wishlist-btn" data-wishlist-btn>♡</button>` : '';

//       const actLabel = isAvailable ? '+ Add to Cart' : 'Sold Out';
//       const actClass = isAvailable ? '' : 'sold-out';

//       // 7d. Assemble
//       return `
//              <article class="pg1-card" data-pg1-product-id="${product.id}" data-pg1-variant-id="${variant?.id || ''}">
//                 <div class="spg-card-media">
//                     <div class="spg-slider" data-slider style="transform:translateX(-${slideIdx * 100}%)">
//                         ${slidesHTML}
//                     </div>
//                     <div class="spg-badges">${badgesHTML}</div>
//                     ${arrowsHTML}
//                     ${wishlistHTML}
//                     <div class="spg-quick-add">
//                         <form method="post" action="/cart/add" novalidate data-spg-atc-form>
//                         <input type="hidden" name="form_type" value="product">
//                         <input type="hidden" name="id" value="${variant?.id || ''}" data-variant-input>
//                         <input type="hidden" name="quantity" value="1">
//                         <button type="submit" name="add"
//                             class="spg-quick-add-btn ${atcClass}"
//                             data-atc-btn
//                             ${!isAvailable ? 'disabled' : ''}>
//                             ${atcLabel}
//                         </button>
//                         </form>
//                     </div>
//                 </div>
//                 <div class="spg-card-body">
//                     <a href="${product.url}" class="spg-card-link">
//                         ${CONFIG.showVendor ? `<p class="spg-card-brand">${product.vendor}</p>` : ''}
//                         <p class="spg-card-title">${product.title}</p>
//                     </a>
//                     ${optionsHTML}
//                     ${priceHTML}
//                 </div>
//             </article>;
//       `;

//       /*********** buildCardHTML **************/
//     }

//     // helper functions:

//     function buildBadgeHTML(product, variant, isAvailable, isSale) {
//       if (!CONFIG.enableBadges) return '';
//       if (!isAvailable) return `<span class="pg1-badge pg1-badge-sold" > Sold Out </span>`; // product is not available
//       if (isSale) return `<span class="pg1-badge pg1-badge-sale">Sale </span>`;
//       if (product.tags?.includes('new')) return `<span class="pg1-badge pg1-badge-new"> New </span>`;
//       return '';
//     }

//     function slidesHTML(images, product) {
//       return images
//         .map((url) => {
//           return `
//             <div class="pg1-slide">
//                 <a href="${product.url}">
//                     <img src="${url}" alt="${product.title}" loading="lazy" >
//                 </a>
//             </div>
//         `;
//         })
//         .join('');
//     }

//     function buildArrowsHTML(images, slideIdx) {
//       if (images.length <= 1) return '';
//       return `
//       <button class="spg-slider-arrow prev" data-slide-prev ${slideIdx === 0 ? 'disabled' : ''}>‹</button>
//       <button class="spg-slider-arrow next" data-slide-next ${
//         slideIdx >= images.length - 1 ? 'disabled' : ''
//       }>›</button>`;
//     }

//     function buildOptionsHTML(product, variant) {
//       return `options (variant selctors) html`;
//     }

//     function buildPriceHTML(price, compareAt, isSale) {
//       const discount = isSale ? Math.round((1 - price / compareAt) * 100) : 0;
//       return `
//         <div class="pg1-card-price">
//           <span class="pg1-price-current" data-pg1-price-${formatMoney(compareAt)} >
//             ${
//               isSale
//                 ? `<span class="pg1-price-original" data-pg1-compare >${formatMoney(compareAt)} </span>
//                    <span class="spg-price-save">−${discount}%</span>`
//                 : '<span data-pg1-compare style="display:none"></span>'
//             }
//              ${discount}
//           </span>
//         </div>
//       `;
//     }

//     // 7.7 Write renderGrid and renderPagination
//     // -- 8. render
//     function (){
//       gridEl
//     }

//     /****************************************************************/
//     //// IFFE ENDS HERE
//   })();
