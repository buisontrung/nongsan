export const APIENDPOINT = "https://localhost:7000";
export const formatPrice = (price: number, quantity: number): string => {
    if (price == null) {
        return "N/A"; // Hoặc giá trị mặc định
    }
    if (quantity !== 0) {
        const totalPrice = price * quantity;
        return totalPrice.toLocaleString('vi-VN'); // Định dạng theo chuẩn Việt Nam với dấu chấm
    }
    return price.toLocaleString('vi-VN'); // Định dạng theo chuẩn Việt Nam với dấu chấm
};