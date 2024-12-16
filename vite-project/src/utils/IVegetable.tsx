interface Category {
    id: number;
    productCategoryName: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
    createDate: string;
  }
  
  interface Product {
    id: number;
    productName: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
    productCategoryId: number;
    price: number;
    minPrice:number;
    maxPrice:number;
    priceSale:number;
    productImageDTOs:ProductImage[],
    productCategoryDTO?:Category,
    productVariantDTOs: productVariant[]
  }
  interface Login{
    userName:string,
    password:string,
  }
  interface post{
    id:string,
    title:string,
    contents:contenttype[],
    createAt:Date,
    updateAt:string,
    author:user,
    images:image[],
    comments:comment[]
  }
  interface image{
    imageId:number,
    url:string,
    description:string,
  } 
  interface user{
    id?:string,
    firstName?:string,
    lastName?:string,
    phoneNumber:string,
  }
  interface contenttype{
    title:string,
    value:string,
    imageUrl:string,
  }
  interface productVariant{
    id:number,
    variantName:string,
    productId:number,
    unitPrice:number,
    productInventorySuppliers: productInventorySupplier[]
  }
  interface productInventorySupplier{
    id:number,
    productVariantId:number,
    supplierId:number,
    inventoryId:number,
    quantity:number
  }
  interface ShoppingCartType{
    shoppingCart:{
      id:number,
      userId:string,
      productVarianId:number,
      quantity:number,
      price:number,
      created:string,
    },
    product: Product
  }
  interface Address{
    id:number,
    userNameAddress: string,
    phoneNumberAddress: string,
    city: string,
    district: string,
    wardsCommunes: string,
    addressName: string,
    userId: string,
    isPrimary: boolean
  }
  interface ShoppingCartItem{
    id:number,
    userId:string,
    productVarianId:number,
    quantity:number,
    price:number,
    created:string,
  }
  interface comment{
    _id:string,
    contents:string,
    createdAt:string,
    updateAt:string,
    author: user
  }
  interface ProductImage{
    id:number,
    imageUrl:string,
    productId:string,
  }
  interface Province {
    id: string;
    name: string;
  }
interface ListProvince{
  total:number,
  data: Province[]
}
interface Promotion {
  id: number;
  promotionCode: string;
  description: string;
  discountPercentage: number;
  quantity: number;
  validFrom: string; // ISO date string
  validTo: string;   // ISO date string
  isActive: boolean;
}

interface Item {
  productId: number;
  quantity: number;
  price: number;
}

interface Order {
  id:number,
  code: string;
  customerName: string;
  phone: string;
  address: string;
  promotionId: number;
  userId: string;
  totalAmount: number;
  discountAmount: number;
  quantity: number;
  paymentMethodId: number;
  isPayment: boolean;
  status:number,
  createDate:string,

}
interface OrderDetail{
  id:number,
  quantity:number,
  price:number,
  productId:number,
  product: Product
}
interface Review{
  id:number,
  content:string,
  userId:string,
  productId:number,
  userName:string,
  rating:number,
  createAt:string,

}
interface RatingCount{
  rating:number,
  count:number

}
  // Sử dụng export type để xuất các interface
  export type { RatingCount,Review,Category, Product,Login,comment,post,user,ShoppingCartType,ShoppingCartItem,Address,Province,ListProvince,Order,Item,Promotion,OrderDetail};
  