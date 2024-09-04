// call this to add event listeners to the extension DOM
function listenFillFormAction() {
	// select the filler-button
	// eslint-disable-next-line no-undef
	const fillerButton = document.querySelector('#filler_button');

	// browser.tabs.query() gets the details of the tabs
	browser.tabs
		.query({
			active: true,
			currentWindow: true,
			url: '*://*.docs.google.com/*',
		})
		.then((tabs) => {
			if (tabs && tabs.length) {
				// attach the event listener
				fillerButton.addEventListener('click', (e) => {
					// to the current tab content script, siiiii:q:qend the following message
					browser.tabs.sendMessage(tabs[0].id, {
						data: 'FILL_FORM',
					});
				});
			} else {
				// Temporary error message for unsupported websites!
				// Triggers for non docs.google.com websites
				// eslint-disable-next-line no-undef
				const errorMsg = document.createElement('p');
				errorMsg.textContent = 'Website not supported!!!';
				// eslint-disable-next-line no-undef
				document.body.appendChild(errorMsg);
			}
		});
}

// on opening the extension
browser.tabs
	.executeScript({ file: '/filler.bundle.js' }) // load the content script
	.then(listenFillFormAction) // attach the event listeners to extension
	.catch((err) => {
		// eslint-disable-next-line no-undef
		const errorMsg = document.createElement('p');
		errorMsg.textContent = err;
		// eslint-disable-next-line no-undef
		document.body.appendChild(errorMsg);
	}); // error reporting
