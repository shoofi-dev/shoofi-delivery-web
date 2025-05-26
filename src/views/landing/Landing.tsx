import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";

// components

import Navbar from "components/Navbars/AuthNavbar";
import Footer from "components/Footers/Footer.js";
import UserDropdown from "components/Dropdowns/UserDropdown";
import clsx from "clsx";
import createLeadApi from "apis/lead/create-lead";
import Profile from "views/Profile";
import Plans from "components/plans";
import { useMediaQueryMatch } from "shared/hooks/media-query-match";
import { duration } from "moment";
const inputLabelClass =
  "block text-lg uppercase text-blueGray-600 font-bold mb-2";
const iconClass =
  "text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full";
const inputClass =
  "border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded  shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150";

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
  "كذألك يتم ملائمة السباحة لكل امرأة بطريقة تختلف عن الأخرى بهدف الحصول على النتيجة الأمثل.",
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
  "(تعويض الدروس يقع على عاتقك).",
];

export default function Landing() {
  const [leadFormData, setLeadFormData] = useState<any>();
  const [branchesList, setBranchesList] = useState<any>([
    { label: "دبورية", value: "1" },
    { label: "الطيبة", value: "2" },
  ]);

  const { ref: logoRef, inView: logoInView } = useInView({ triggerOnce: true });
  const { ref: welcomeRightRef, inView: welcomeRightnInView } = useInView({ triggerOnce: true });
  const { ref: welcomeLeftRef, inView: welcomeLeftInView } = useInView({ triggerOnce: true });


  const { ref: takamRef, inView: takamInView } = useInView({ triggerOnce: true });
  const { ref: rehamRef, inView: rehamInView } = useInView({ triggerOnce: true });
  const { ref: linaRef, inView: linaInView } = useInView({ triggerOnce: true });
  const { ref: azaRef, inView: azanView } = useInView({ triggerOnce: true });
  const { ref: hakaRef, inView: halaInView } = useInView({ triggerOnce: true });
  const { ref: lamaRef, inView: lamaInView } = useInView({ triggerOnce: true });

  const registerRef = useRef<any>(null);

  const isAboveLg = useMediaQueryMatch("md");
  console.log("isAboveLg", isAboveLg);
  const handleInputChange = (name: string, event: any) => {
    const target = event.target;
    const value = target.value;
    setLeadFormData({ ...leadFormData, [name]: value });
  };

  const createLead = () => {
    createLeadApi(leadFormData);
  };

  const getInputClass = () => {
    // switch (formMode) {
    //   case formModes.edit:
    //     return "bg-white";
    //   case formModes.addNew:
    //     return "bg-white";
    //   case formModes.preview:
    //     return "bg-blueGray-100";
    //   default:
    //     return "";
    // }
  };

  const scrollToRegister = () => {
    if(registerRef){
      registerRef?.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar onClick={scrollToRegister} />
      <main className="bg-blueGray-200 ">
        <section
          className="bg-blueGray-200 md:h-screen h-80	bg-cover "
          style={{
            backgroundImage: isAboveLg
              ? "url('/images/profile/DSC03693.jpg')"
              : "url('/images/profile/reham-7fe.jpg')",
          }}
        >
          <div
            ref={logoRef}
            className={`mx-auto md:pt-20 justify-center pt-12 md:pt-0 ${
              logoInView ? "animate__animated animate__fadeInDown" : ""
            }`}
          >
            <img
              alt="..."
              src="/icon.png"
              className="align-middle rounded-t-lg h-32 md:h-40 self-center m-auto"
            />
          </div>
        </section>

        <Profile />

        {/* <div className="container relative mx-auto mt-28 ">
            <div className="w-2/3  m-auto">
            <img
                    alt="..."
                    src="/logo-large.png"
                    className="align-middle rounded-t-lg"
                  />
            </div>
             
            <div className="items-center flex flex-wrap mt-">
              <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                <div className="pr-12">
                  <h1 className="text-white font-semibold text-5xl">
                    Your story starts with us.
                  </h1>
                  <p className="mt-4 text-lg text-blueGray-200">
                    This is a simple example of a Landing Page you can build
                    using Notus React. It features multiple CSS components based
                    on the Tailwind CSS design system.
                  </p>
                </div>
              </div>
            </div>
          </div> */}
        {/* <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
            style={{ transform: "translateZ(0)" }}
          >
     
          </div> */}

        <section className="pb-20 bg-blueGray-100 relative block">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
              {/* <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                      <i className="fas fa-award"></i>
                    </div>
                    <h6 className="text-xl font-semibold">Awarded Agency</h6>
                    <p className="mt-2 mb-4 text-blueGray-500">
                      Divide details about your product or agency work into
                      parts. A paragraph describing a feature will be enough.
                    </p>
                  </div>
                </div>
              </div> */}
              {/* 
              <div className="w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-lightBlue-400">
                      <i className="fas fa-retweet"></i>
                    </div>
                    <h6 className="text-xl font-semibold">Free Revisions</h6>
                    <p className="mt-2 mb-4 text-blueGray-500">
                      Keep you user engaged by providing meaningful information.
                      Remember that by this time, the user is curious.
                    </p>
                  </div>
                </div>
              </div> */}

              {/* <div className="pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-emerald-400">
                      <i className="fas fa-fingerprint"></i>
                    </div>
                    <h6 className="text-xl font-semibold">Verified Company</h6>
                    <p className="mt-2 mb-4 text-blueGray-500">
                      Write a few lines about each one. A paragraph describing a
                      feature will be enough. Keep you user engaged!
                    </p>
                  </div>
                </div>
              </div> */}
            </div>

            <div className="flex flex-wrap items-center mt-5 lg:mt-32">
              <div className={clsx('w-full md:w-5/12 px-4 mr-auto ml-auto', welcomeRightnInView ? "animate__animated animate__fadeInRight" : "")}   ref={welcomeRightRef}
              >
                <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white">
                  <i className="fas fa-user-friends text-xl"></i>
                </div>
                <h3 className="text-3xl mb-2 font-semibold leading-normal">
                  مرحبا بك, واهلا بك في عائلتنا،
                </h3>
                <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600">
                  شعارنا هو المهنية, المصداقية والامانة. من اهم اسس المشروع هو
                  العمل على الشعور بالانتماء, ولهذا هدفنا تقديم الافضل على
                  الصعيد المهني وبذل قصارى جهودنا لإكسابك افضل الاليات وطرق
                  السباحه الناجعة وفقا لخبرتنا في المجال على اكمل وجه. بالمقابل
                  , اننا على ثقة تامة بان تكوني على قدر عال من المسؤولية, احترام
                  قوانين المشروع وافراده والحفاظ على السرية.
                </p>
              </div>

              <div className={clsx('w-full md:w-4/12 px-4 mr-auto ml-auto', welcomeLeftInView && isAboveLg ? "animate__animated animate__fadeInLeft" : "")} ref={welcomeLeftRef}>
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg bg-lightBlue-500">
                  <img
                    alt="..."
                    src={require("assets/img/team-members/team.jpeg")}
                    className="w-full align-middle rounded-t-lg"
                  />
                  <blockquote className="relative p-8 mb-4">
                    <svg
                      preserveAspectRatio="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 583 95"
                      className="absolute left-0 w-full block h-95-px -top-94-px"
                    >
                      <polygon
                        points="-30,95 583,95 583,65"
                        className="text-lightBlue-500 fill-current"
                      ></polygon>
                    </svg>
                    <h4 className="text-xl font-bold text-white">
                      عالم السباحة
                    </h4>
                    <p className="text-md font-light mt-2 text-white">
                      معا نسعى للحفاظ على السمعة الطيبة للمشروع, وحدته ونجاحه.
                      نرحب بك في كل حب.
                    </p>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="text-blueGray-200 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </section>

        {/* <section className="relative py-20">
          <div
            className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20"
            style={{ transform: "translateZ(0)" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-blueGray-200 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>

          <div className="container mx-auto px-4">
            <div className="items-center flex flex-wrap">
              <div className="w-full md:w-4/12 ml-auto mr-auto px-4">
                <img
                  alt="..."
                  className="max-w-full rounded-lg shadow-lg"
                  src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
                />
              </div>
              <div className="w-full md:w-5/12 ml-auto mr-auto px-4">
                <div className="md:pr-12">
                  <div className="text-lightBlue-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-lightBlue-300">
                    <i className="fas fa-rocket text-xl"></i>
                  </div>
                  <h3 className="text-3xl font-semibold">رُزمة تعليم سباحة (المرحلة الاولى)</h3>
                  <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
                  يتم ملائمة الرُزمة حسب احتياجات المجموعة وقدراتها الجسدية والنفسية.
                  </p>
                  <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
                  الهدف من اللقاءات :
                  </p>
                  <ul className="list-none mt-6">
                    {course1Goals.map((goal)=>{
                      return(
                        <li className="py-2">
                        <div className="flex ">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-lightBlue-600 bg-lightBlue-200 mr-3">
                              <i className="fas fa-fingerprint"></i>
                            </span>
                          </div>
                          <div className="px-2">
                            <h4 className="text-blueGray-500">
                              {goal}
                            </h4>
                          </div>
                        </div>
                      </li>
                      )
                    })}

                  </ul>
                  <div className="w-100 text-center mt-10 font-semibold">
            مهم بعد كل درس البقاء بالبركة ما لا يقل عن نص الساعة (أقل تعديل) لممارسة التمارين المكتسبة بالدرس بهدف إتقانها على أكمل وجه والحصول على نتيجة نهائية ممتازة. لان السباحة هي لغة يجب على الجسد والعقل تعلمها.
            </div>
                </div>
              </div>x
              
            </div>

            
          </div>
        </section> */}

        <section className="pt-10 lg:pt-20 lg:pb-48">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center text-center mb-8 lg:mb-24">
              <div className="w-full lg:w-6/12 px-4">
                <h2 className={clsx('text-4xl font-semibold', takamInView ? "animate__animated animate__bounceInUp" : "")} ref={takamRef}>طاقم المشروع</h2>
                {/* <p className="text-lg leading-relaxed m-4 text-blueGray-500">
                  According to the National Oceanic and Atmospheric
                  Administration, Ted, Scambos, NSIDClead scentist, puts the
                  potentially record maximum.
                </p> */}
              </div>
            </div>
            <div className="flex flex-wrap justify-center">
              <div className=" lg:mb-0 mb-12 px-4">
                <div className={clsx('px-6', rehamInView ? "animate__animated animate__fadeInUp animate__delay-14s" : "")} ref={rehamRef}>
                  <img
                    alt="..."
                    src={require("assets/img/team-members/reham.png")}
                    className="shadow-lg rounded-full mx-auto w-[160px] h-[280px] p-5"
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">رهام منصور</h5>
                    <p className="mt-1 text-sm text-blueGray-500 uppercase font-semibold">
                      مؤسسة المشروع
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:mb-0 mb-12 px-4">
              <div className={clsx('px-6', linaInView ? "animate__animated animate__fadeInUp animate__delay-15s" : "")} ref={linaRef}>
              <img
                    alt="..."
                    src={require("assets/img/team-members/lina.png")}
                    className="shadow-lg rounded-full mx-auto w-[160px] h-[280px] p-5"
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">لينا مصاروه بشاره</h5>
                    <p className="mt-1 text-sm text-blueGray-500 uppercase font-semibold">
                      مديرة تنفيذية
                    </p>
                  </div>
                </div>
              </div>
              <div className="  lg:mb-0 mb-12 px-4">
              <div className={clsx('px-6', azanView ? "animate__animated animate__fadeInUp animate__delay-16s" : "")} ref={azaRef}>
                  <img
                    alt="..."
                    src={require("assets/img/team-members/aza.png")}
                    className="shadow-lg rounded-full mx-auto w-[160px] h-[280px] p-5"
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">ليان (عزة) منصور</h5>
                    <p className="mt-1 text-sm text-blueGray-500 uppercase font-semibold">
                      مركزة المشاريع & سوشيال ميديا
                    </p>
                  </div>
                </div>
              </div>
              <div className="  lg:mb-0 mb-12 px-4">
              <div className={clsx('px-6', halaInView ? "animate__animated animate__fadeInUp animate__delay-17s" : "")} ref={hakaRef}>
                  <img
                    alt="..."
                    src={require("assets/img/team-members/hala.png")}
                    className="shadow-lg rounded-full mx-auto w-[160px] h-[280px] p-5"
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">هلا ابوحية</h5>
                    <p className="mt-1 text-sm text-blueGray-500 uppercase font-semibold">
                      تسويق وكتابة محتوى
                    </p>
                  </div>
                </div>
              </div>
              <div className="  lg:mb-0 mb-12 px-4">
              <div className={clsx('px-6', lamaInView ? "animate__animated animate__fadeInUp animate__delay-18s" : "")} ref={lamaRef}>
                  <img
                    alt="..."
                    src={require("assets/img/team-members/lama.png")}
                    className="shadow-lg rounded-full mx-auto w-[160px] h-[280px] p-5"
                  />
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">لمى قاسم</h5>
                    <p className="mt-1 text-sm text-blueGray-500 uppercase font-semibold">
                      تسويق وكتابة محتوى
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-32 lg:pb-80 relative block bg-blueGray-800">
          <Plans />
        </section>
        {/* <section className="pb-20 relative block bg-blueGray-800">

        </section> */}
        <section className="relative block py-24 lg:pt-0 bg-blueGray-800" ref={registerRef}>
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center lg:-mt-64 -mt-48">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200">
                  <div className="flex-auto p-5 lg:p-10">
                    <h4 className="text-2xl font-semibold">
                      للاستفسار والتسجيل
                    </h4>
                    <p className="leading-relaxed mt-1 mb-4 text-blueGray-500">
                      املأ التفاصيل وسنعاود الاتصال بك:
                    </p>
                    <div className="relative w-full mb-3 mt-8">
                      <label
                        className="block uppercase text-blueGray-600 text-md font-bold mb-2"
                        htmlFor="full-name"
                      >
                        الاسم
                      </label>
                      <input
                        onChange={(e) => handleInputChange("fullName", e)}
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-md font-bold mb-2"
                        htmlFor="email"
                      >
                        رقم الهاتف
                      </label>
                      <input
                        onChange={(e) => handleInputChange("phone", e)}
                        type="number"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className={inputLabelClass}
                        htmlFor="grid-password"
                      >
                        الفرع
                      </label>
                      <select
                        name="branch"
                        className={clsx("pr-12", inputClass, "bg-blueGray-100")}
                        value={leadFormData?.branchId}
                        onChange={(e) => handleInputChange("branchId", e)}
                      >
                        <option value="" selected disabled hidden>
                          اختر الغرع
                        </option>
                        {branchesList?.map((branch: any) => (
                          <option value={branch.value}>
                            <span>{branch.label}</span>
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-center mt-6">
                      <button
                        className="bg-blueGray-800 text-white active:bg-blueGray-600 text-md font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={createLead}
                      >
                        ارسل
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
