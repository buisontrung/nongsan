const homepartner: string[] = [
    "logo-doi-tac-1.png",
    "logo-doi-tac-2.png",
    "logo-doi-tac-3.png",
    "logo-doi-tac-4.png",
    "logo-doi-tac-5.png",
    

];
const orderArr:{name:string,status:number}[]=[
  {
    name:"Tất cả",
    status:0
  },
  {
    name:"Đang xử lí",
    status:1
  },
  {
    name:"Đang chuẩn bị",
    status:2
  },
  {
    name:"Chờ giao hàng",
    status:3
  },
  {
    name:"Hoàn thành",
    status:4
  },
  {
    name:"Đã hủy",
    status:5
  }
]
const navArray: { name: string; url: string }[] = [
    {
      name: "TRANG CHỦ",
      url: ""
    },
    {
      name: "GIỚI THIỆU",
      url: "gioi-thieu"
    },
    {
      name: "SẢN PHẨM",
      url: "danh-muc-san-pham"
    },
    {
      name: "HÔM NAY ĂN GÌ ?",
      url: "danh-muc-bai-viet"
    },
    {
      name: "SỨ MỆNH",
      url: "ve-chung-toi"
    },
    
  ];
  const introducearr: { name: string; content:string[]} = {
    name:"Giới Thiệu",
    content:[
      "Nông Sản Xanh là một trong những hợp tác xã đạt tiêu chuẩn VietGAP tiêu biểu của Cần Thơ. Chúng tôi chuyên cung cấp các loại rau củ, quả và các sản phẩm tươi sống có chứng nhận VietGAP và an toàn.",
      "Nông Sản Xanh được thành lập năm 2016, đã có hơn 7 năm kinh nghiệm trong lĩnh vực nông sản. Chúng tôi tự hào là một trong những hợp tác xã uy tín vinh dự được cung cấp các sản phẩm nông sản vào các hệ thống siêu thị Lotte, MM Mega Market, Satra Food, Coopfood, Coop Mart, GO.",
      "Tại cửa hàng bán lẻ, chúng tôi cung cấp sản phẩm đa dạng, đầy đủ từ nông sản đến các sản phẩm thịt, hạt, gạo, bún, miến, gia vị. Quý khách hàng có thể dễ dàng mua sắm tại cửa hàng của chúng tôi hoặc qua kênh bán trực tuyến. Chúng tôi cũng cung cấp dịch vụ đi chợ qua hình ảnh, video call và vận chuyển nhanh chóng để đáp ứng nhu cầu của khách hàng.",
      "Chúng tôi có chính sách giá ổn định, giao hàng và hậu mãi tốt. có đội ngũ nhân viên trẻ thân thiện và nhiệt tình. Bạn sẽ bất ngờ về phong cách phục vụ chuyên nghiệp của Nông Sản Xanh và về những sản phẩm độc đáo của chúng tôi.",
      "Chúng tôi luôn luôn tâm huyết và nỗ lực hết sức để cung cấp cho quý khách hàng những sản phẩm chất lượng tốt nhất. Nếu bạn đang tìm kiếm một nhà cung cấp nông sản uy tín, hãy nhớ Nông Sản Xanh . Chúng tôi luôn sẵn sàng phục vụ bạn."
    ]
  };
export {homepartner,navArray,introducearr,orderArr}