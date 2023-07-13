/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapStart.js":
/*!****************************!*\
  !*** ./src/js/mapStart.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function(){\r\n    const lat = 20.67444163271174;\r\n    const lng = -103.38739216304566;\r\n    const map = L.map('map-start').setView([lat, lng ], 16);\r\n\r\n    let markers = new L.FeatureGroup().addTo(map)\r\n\r\n    let properties = [];\r\n\r\n    const filters = {\r\n        category:'',\r\n        price:''\r\n    }\r\n\r\n    const categorySelect = document.querySelector('#categories');\r\n    const priceSelect = document.querySelector('#prices');\r\n\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(map);\r\n\r\n\r\n    categorySelect.addEventListener('change', e => {\r\n        filters.category = +e.target.value\r\n        searchProperties()\r\n    })\r\n\r\n    priceSelect.addEventListener('change', e => {\r\n        filters.price = +e.target.value\r\n        searchProperties()\r\n    })\r\n\r\n    const getProperties = async () => {\r\n        try {\r\n            const url = '/api/properties'\r\n            const result = await fetch(url)\r\n            properties = await result.json()\r\n            showProperties(properties)\r\n        } catch (error) {\r\n            console.log(error)\r\n        }\r\n    }\r\n\r\n    const showProperties = properties => {\r\n\r\n        markers.clearLayers()\r\n        \r\n        properties.forEach(property => {\r\n            const marker = new L.marker([property?.lat,property?.lng],{\r\n                autoPan:true\r\n            })\r\n            .addTo(map)\r\n            .bindPopup(`\r\n                <p class=\"text-indigo-600 font-bold\">${property.category.name}</p>\r\n                <h1 class=\"text-xl font-extrabold uppercase my-2\">${property?.title}</h1>\r\n                <img src=\"/uploads/${property?.image}\" alt=\"Imagen de la Propiedad ${property?.title}\">\r\n                <p class=\"text-gray-600 font-bold\">${property.price.name}</p>\r\n                <a href=\"/property/${property.id}\" class=\"bg-indigo-600 block p-2 text-center font-bold uppercase text-white\">Ver Propiedad</a>\r\n            `)\r\n\r\n            markers.addLayer(marker)\r\n        })\r\n\r\n    }\r\n\r\n    const searchProperties = () => {\r\n        const result = properties.filter( searchCategory ).filter(searchPrice)\r\n        showProperties(result)\r\n    }\r\n\r\n    const searchCategory = property => filters.category ? property.idCategory === filters.category : property\r\n\r\n    const searchPrice = property => filters.price ? property.idPrice === filters.price : property\r\n\r\n    getProperties()\r\n})()\n\n//# sourceURL=webpack://bienesraices-mvc/./src/js/mapStart.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapStart.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;