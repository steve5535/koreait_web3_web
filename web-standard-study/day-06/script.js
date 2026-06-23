// 상품 총액 금액 반환
const calculateTotalPrice = (price, number) => price * number;

// 회원이고 쿠폰이 있으면 총 금액 10%할인 후 반환
function calculateDiscountPrice(total_price, isMember, isTakeCoupon) {
    if (isMember && isTakeCoupon) {
        return total_price - (total_price * 0.1)
    }
    return total_price
}

// 배달비 계산 함수
function calculateDeliveryFee(discountPrice) {
    if (discountPrice >= 50000) {
        return 0
    }
    return 3000
}

// 최종 결제 금액 계산 함수
function calculateFinalPrice(discountPrice, deliveryFee) {
    return discountPrice + deliveryFee
}

const productName = '무선 키보드';
const productPrice = 5000;
const orderCount = 2;
const stockCount = 5;
const isMember = true;
const hasCoupon = true;

let totalPrice = calculateTotalPrice(productPrice, orderCount)
let discountPrice = calculateDiscountPrice(totalPrice, isMember, hasCoupon);
let deliveryFee = calculateDeliveryFee(discountPrice);
let finalPrice = calculateFinalPrice(discountPrice, deliveryFee);

console.log(`상품명:${productName}`);
console.log(`총 상품 금액: ${totalPrice}원`);
console. log(`할인된 금액: ${discountPrice}원`);
console.log(`배송비: ${deliveryFee}원`);
console.log(`최종 결제 금액: ${finalPrice}원`);