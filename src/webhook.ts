import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

import CONFIG from "../config.json";



export async function lookup(): Promise<number> {
	const response = await fetch("http://ncore.co.kr/bbs/support_AdviceList_View.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			"Referer": "http://ncore.co.kr/bbs/support_AdviceList.php",
		},
		body: `NaId=${CONFIG.trackId}`,
	});

	const dom = new JSDOM(await response.text());
	const adviceElements = dom.window.document.querySelectorAll("div.advice_content > table.advice_content");

	if(adviceElements.length > 1) {
		const embedList: any[] = [];

		for(const element of adviceElements) {
			const $date = element.querySelector("tr:nth-child(1) > td:nth-child(2)");
			const $state = element.querySelector("tr:nth-child(1) > td:nth-child(4)");
			//const $author = element.querySelector("tr:nth-child(2) > td:nth-child(2)");
			const $content = element.querySelector("tr > td > .text_doc");
			
			embedList.push({
				title: $state === null? '' : $state.textContent,
				description: $content === null? '' : $content.textContent,
				footer: {
					text: $date === null? '' : $date.textContent,
				},
			});
		}
		
		await fetch(`https://discord.com/api/webhooks/${CONFIG.webhook.id}/${CONFIG.webhook.token}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content: "<@&1194309727295918210> 답변이 도착했습니다!",
				embeds: embedList
			})
		});
	}


	return adviceElements.length;
};
