import React from "react";

const course1Goals = [
    "غذاء للروح والجسد.",
    "تطوير مهارات في السباحة, حسب قوانين ال FINA.",
    "تعلم التنفس في الماء بشكل سهل وسلس ، بهدف كسب الثقة والسباحة بشكل صح, مضبوط ومريح.",
    "فهم كيفية التعامل مع الجسم داخل الماء بشكل مريح ومفيد.",
    "القدرة على فهم، واستعمال الحركات بطريقة صحيحة ومتقنة.",
    "تعلم طرق للتأقلم في المياه العميقة (لمن تحتاج).",
    "الانتقال للمرحلة الثانية بنجاح, كمرحلة انتقالية ما قبل فرقة التدريب.",
    "التعامل مع تحديات ذاتية وشخصية بشكل مهني ومتفهم.",
    "تحويل السباحة من هواية الى رياضة.",
    "التعليم يتم مع كل امرأة حسب قدراتها وتطورها في التعامل مع الماء.",
    "كذألك يتم ملائمة السباحة لكل امرأة بطريقة تختلف عن الأخرى بهدف الحصول على النتيجة الأمثل."
];
const courseNotes = [
  "التسجيل للدورة يتم بعد دفع مقدمة (400 شيكل) الرجاء عدم الاحراج من لا تدفع المبلغ فهي غير مسجلة بشكل رسمي.",
  "بقية المبلغ يدفع في اللقاء الاول.",
  "يجب تعبئة إستمارة (הצהרת בריאות) قبل بداية دورة السباحة عن طريق تطبيق TRAX.",
  "دخول البركة مشروط بلباس ملائم وطقية للشعر. بهدف الحفاظ على صحتنا وصحة غيرنا.",
  "يتم تصوير كل مشتركة (بعد الموافقة) لغرض التعليم (ليس للنشر)، وتحليل الحركات بشكل شخصي ومهني.",
  "بعد إنتهاء الدرس يتم إرسال نص كلامي وفيديوهات متنوعة ومختلفة تتعلق بفحوى درس السباحة، بهدف تذويت الحركات بالعقل والجسد.",
  "امكانية التعويض حتى 20% من مجمل اللقاءات.",
  "عند تغيب عن اللقاء يتم تعويضه بتنسيق مسبق مع واحده من المجموعات، بحال تمكن ذألك.",
  "(تعويض الدروس يقع على عاتقك)."
]

export type TProps = {
    title: string,
    duration: string,
    count: string;
    teamCount: string;
    price: string;
}

const PlanDetails = ({title, duration, count, teamCount, price}: TProps) => {
  return (
    <>

      <div className="container mx-auto lg:px-4 lg:pt-10 lg:pb-10">
        <div className="flex flex-wrap text-center justify-center">
          <div className="w-full lg:w-6/12 px-4">
            <h2 className="text-lg lg:text-4xl font-semibold text-white">
              رُزمة تعليم سباحة - {title}
            </h2>
            <p className="text-md lg:text-xl leading-relaxed mt-4 lg:mb-4 text-blueGray-200">
              قبل بداية دورة السباحة، مهم التنويه لعدة نقاط مهمة :
            </p>
          </div>
        </div>

        <div className="flex flex-wrap lg:mt-10">
          <div className="lg:pt-6 pt-6 w-full md:w-4/12 px-4 text-center">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
              <div className="px-4 py-5 flex-auto">
                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                  <i className="fas fa-clock"></i>
                </div>
                <h6 className="text-xl font-semibold">مدة الدرس</h6>
                <p className="mt-2 mb-4 text-blueGray-500">{duration}</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-4/12 px-4 text-center">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
              <div className="px-4 py-5 flex-auto">
                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-lightBlue-400">
                  <i className="fas fa-person-swimming"></i>
                </div>
                <h6 className="text-xl font-semibold">عدد الدروس</h6>
                <p className="mt-2 mb-4 text-blueGray-500">{count}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 w-full md:w-4/12 px-4 text-center">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
              <div className="px-4 py-5 flex-auto">
                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-emerald-400">
                  <i className="fas fa-users"></i>
                </div>
                <h6 className="text-xl font-semibold">عدد النساء بالمجموعة</h6>
                <p className="mt-2 mb-4 text-blueGray-500">{teamCount}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 md:w-4/12 px-4 text-center  m-auto w-full ">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg 	">
              <div className="px-4 py-5 flex-auto">
                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-emerald-400">
                  <i className="fas fa-money-bill-1-wave"></i>
                </div>
                <h6 className="text-xl font-semibold">التكلفة</h6>
                <p className="mt-2 mb-4 text-blueGray-500 ">{price}</p>
              </div>
            </div>
          </div>
        </div>

        <ul className="list-none mt-6">
          {courseNotes.map((goal) => {
            return (
              <li className="py-2">
                <div className="flex ">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-lightBlue-600 bg-lightBlue-100 mr-3">
                      <i className="fas fa-check"></i>
                    </span>
                  </div>
                  <div className="px-2">
                    <h4 className="text-blueGray-100 text-lg">{goal}</h4>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-wrap text-center justify-center mt-20">
          <div className="w-full lg:w-6/12 px-4">
            <h3 className="text-xl lg:text-3xl font-semibold text-white">
              امكانيات الدفع المتاحة
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap mt-6 lg:mt-12 justify-center space-y-8 lg:space-y-0">
          <div className="w-full lg:w-3/12 px-4 text-center">
            <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
              <i className="fas fa-b text-xl"></i>
            </div>
            <h6 className="text-lg lg:text-xl mt-2 lg:mt-5 font-semibold text-white">
              عبر تطبيق bit
            </h6>
          </div>
          <div className="w-full lg:w-3/12 px-4 text-center">
            <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
              <i className="fas fa-building-columns text-xl"></i>
            </div>
            <h5 className="text-lg lg:text-xl mt-2 lg:mt-5 font-semibold text-white">
              تحويل المبلغ عبر حساب البنك
            </h5>
          </div>
          <div className="w-full lg:w-3/12 px-4 text-center">
            <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
              <i className="fas fa-credit-card text-xl"></i>
            </div>
            <h5 className="text-lg lg:text-xl mt-2 lg:mt-5 font-semibold text-white">
              الدفع بواسطة بطاقة الائتمان. (امكانية تقسيط المبلغ حتى 4 دفعات)
            </h5>
          </div>
          <div className="w-full lg:w-3/12 px-4 text-center">
            <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
              <i className="fas fa-wallet text-xl"></i>
            </div>
            <h5 className="text-lg lg:text-xl mt-2 lg:mt-5 font-semibold text-white">
              نقدا في الدرس الاول
            </h5>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanDetails;
