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
  // Sử dụng export type để xuất các interface
  export type { Category, Product,Login,comment,post,user,ShoppingCartType,ShoppingCartItem,Address,Province,ListProvince};
  