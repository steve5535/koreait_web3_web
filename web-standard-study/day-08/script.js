const reult = confirm("주문을 진행하시겠습니까?");

if (reult) {
    productName = prompt("상품명을 입력하세요");
    productPrice = prompt("상품가격을 입력하세요");
    productStock = prompt("상품 수량을 입력하세요");
    productPrice = Number(productPrice);
    priceIsNaN = isNaN(productPrice);
    if (priceIsNaN) {
        productPrice = prompt("상품가격을 입력하세요");
    }
    productStock = Number(productStock);
    stockIsNaN = isNaN(productStock);
    if (stockIsNaN) {
        productPrice = prompt("상품 수량을 입력하세요");
    }

    totalPrice = productPrice * productStock;
    discountprice = totalPrice * 0.1;
    finalPrice = totalPrice - discountprice;

    const ranNam = Math.floor(Math.random() * 100000);
    orderNum = "ORD-" + ranNam;

    const order = {
        주문번호: orderNum,
        가격: productPrice,
        상품명: productName,
        갯수: productStock,
        할인금액: discountprice,
        최종금액: finalPrice 
    };

    console.log(JSON.stringify(order));

    setTimeout(() => {
        alert("주문이 완료되었습니다")
    }, 2000)
} else {
    alert("주문이 취소되었습니다")
}