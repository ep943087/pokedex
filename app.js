window.onload = () => {
	updateList();
}

const container = document.getElementById('container');
const max = 802;
const sortBy = document.getElementById('sortBy');

const clearContainer = () => {
	while(container.firstChild){
		container.removeChild(container.firstChild);
	}
}

const displayPokedex = (data) => {
	let info;
	for(let entries of data.flavor_text_entries){
		if(entries.language.name=="en"){
			info = entries.flavor_text;
			break;
		}	
	}
	const infoTag = document.createElement('div');
	infoTag.className = "pokeInfo";
	infoTag.innerHTML = info;
	container.appendChild(infoTag);

	const genus = document.createElement('div');
	for(let g of data.genera){
		if(g.language.name=="en"){
			genus.textContent = g.genus;
			break;
		}
	}
	
	const name = document.createElement('div');
	name.textContent = getNumber(data.id) + " " + data.name.charAt(0).toUpperCase() + data.name.slice(1);
	name.style.marginTop = "40px";
	name.style.marginBottom = "20px";

	const stats = document.querySelector('.pokeStats');
	stats.appendChild(name);
	stats.appendChild(genus);

}

const getPokedex = (number) => {
	const url = "https://pokeapi.co/api/v2/pokemon-species/" + number;	
	fetch(url).then(response=>{
		response.json().then(displayPokedex);
	});
}

const getInfo = (data) => {	

	const desc = document.createElement('div');
	desc.className = "pokeDesc";
	container.appendChild(desc);

	const stats = document.createElement('div');
	stats.className = "pokeStats";
	desc.appendChild(stats);


	const src = data.sprites.front_default;
	const img = document.createElement('img');
	img.src = src;
	img.className = "pokeimg";

	desc.appendChild(img);

	getPokedex(data.id);	

	const back = document.createElement('button');
	back.textContent = "Back to List";
	back.className = "center";
	back.addEventListener('click',updateList,false);
	back.style.margin = "0px 15px";

	const left = data.id>1? data.id-1 : max;
	const prev = document.createElement('button');
	prev.textContent =  "<< " + getNumber(left);
	prev.onclick = (e) => { pokeInfo(left) };

	const right = data.id<max? data.id+1 : 1;
	const next = document.createElement('button');
	next.textContent =  getNumber(right) + " >>";
	next.onclick = (e) => { pokeInfo(right) };

	const buttons = document.createElement('div');
	buttons.className = "center";
	buttons.appendChild(prev);
	buttons.appendChild(back);
	buttons.appendChild(next);

	container.appendChild(buttons);
	
}

const pokeInfo = (id) => {
	clearContainer();

	const url = "https://pokeapi.co/api/v2/pokemon/" + id;
	fetch(url).then(response=>{
		response.json().then(getInfo);				
	});
}

const getNumber = i => {
	if(i<10)
		return "00" + i;
	else if(i<100)
		return "0" + i;
	return i;
}

const swap = (lst,i,j) => {
	const t = lst[i];
	lst[i] = lst[j];
	lst[j] = t;
}

const partition = (lst,low,high) => {
	let j = low;
	const pivot = lst[high].name;
	for(let i=low;i<high;i++){
		if(lst[i].name<pivot){
			swap(lst,i,j);
			j++;
		}
	}
	swap(lst,j,high);
	return j;
}	

const quicksort = (lst,low,high) => {
	if(low<high){
		const j = partition(lst,low,high);
		quicksort(lst,low,j-1);
		quicksort(lst,j+1,high);
	}
}

const initList = (data) => {
	clearContainer();
	const results = data.results;
	const list = document.createElement('div');
	list.className = "list";

	container.appendChild(list);

	for(let i=0;i<results.length;i++){
		results[i].id = i+1;
	}

	if(sortBy.value=="Name"){
		quicksort(results,0,max-1);

	}
	for(let result of results){
		const label = document.createElement('div');
		label.className = "pokeList";
		const name = result.name;
		const id = result.id;
		label.innerHTML = getNumber(id) + " -  " + name.charAt(0).toUpperCase()+name.slice(1);
		label.addEventListener('click',(e)=>{
			pokeInfo(id);
		},false);				
		list.appendChild(label);
	}	
	
}

const updateList = () => {
	clearContainer();
	container.innerHTML = "<h1>Loading Pokemon...</h1>";

	fetch('https://pokeapi.co/api/v2/pokemon?limit=' + max).then(response=>{
		response.json().then(initList);
	});
}

