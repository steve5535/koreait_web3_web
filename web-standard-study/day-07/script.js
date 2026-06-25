const menus = [
    { id: 1, name: '아메리카노', price: 4000, isSoldOut: false},
    { id: 2, name: '카페라떼', price: 4500, isSoldOut: false},
    { id: 3, name: '바닐라라떼', price: 5000, isSoldOut: true},
    { id: 4, name: '자몽에이드', price: 5500, isSoldOut: false}
]

menus.push(
    {id:5, name: '딸기라떼', price: 5300, isSoldOut: false}
)

let newMap = [];
for (m of menus) {
    if (m.isSoldOut) {
        console.log("판매 불가 상품입니다");
    };
};

const newMenu = menus
    .filter((menu) => menu.isSoldOut === false)
    .map((menu) => menu.name);

console.log(newMenu);

const latte = menus.find((item)=> item.name === '카페라떼');
console.log(latte);