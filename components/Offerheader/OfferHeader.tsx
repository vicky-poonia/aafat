import axios from "axios";
import style from "./OfferHeader.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { updateRedirection } from "redux/Redirection/redirect-actions";
import { alertBox } from "redux/AlertBox/alert-actions";
import {addComboSlugAction} from "redux/ComboSlug/combo-slug-action"
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const OfferHeader = ({ userData, redirectionAction,showTimer,data,subscription,alertBoxAction,comboSlugAction}) => {
  const [activePlans,setActivePlans] = useState([])
  const router = useRouter();
  useEffect(()=>{
    if(subscription){
      let activePlans = subscription.active_plans.filter((itm)=> itm.is_plan_active == true)
      setActivePlans(activePlans)
    }
  },[subscription])
  return (
    <>
      {showTimer && (
        <div className={style.offer_header} style={{background:`${data?.background_color}`,color:`${data?.text_color}`}}>
          <svg width="20px" fill={`${data?.text_color}`}xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 128 128" viewBox="0 0 128 128" id="loudspeaker"><path d="M103.98 24.84c.8 0 1.59-.31 2.18-.94l3.07-3.25c1.14-1.2 1.09-3.1-.12-4.24-1.2-1.14-3.1-1.09-4.24.12l-3.07 3.25c-1.14 1.2-1.09 3.1.12 4.24C102.5 24.57 103.24 24.84 103.98 24.84zM102.16 50.18c1.73 4.74 3.03 9.52 3.88 14.21.26 1.45 1.52 2.47 2.95 2.47.18 0 .36-.02.54-.05 1.63-.29 2.71-1.85 2.42-3.48-.74-4.09-1.81-8.23-3.17-12.36l13.59-4.95c1.56-.57 2.36-2.29 1.79-3.85-.57-1.56-2.29-2.36-3.85-1.79 0 0-16.29 5.93-16.35 5.95C102.4 46.9 101.6 48.62 102.16 50.18zM89.14 43.63c-3.63-1.69-7.7-1.87-11.47-.5-.16.06-.31.13-.46.21-.16.03-.32.07-.48.13-1.5.55-4.09 2.21-4.58 7.22-.29 2.94.24 6.45 1.48 9.87 2.56 7.02 7.07 11.46 11.32 11.46.69 0 1.38-.12 2.04-.36l.94-.34c3.77-1.37 6.77-4.12 8.46-7.76s1.87-7.7.5-11.47C95.53 48.33 92.77 45.32 89.14 43.63z"></path><path d="M123.35,78.3l-19.48-6.74c-1.57-0.54-3.27,0.29-3.82,1.85c-0.54,1.57,0.29,3.27,1.85,3.82l5.17,1.79
		c-0.51,9.03-3.45,15.32-8.03,16.99c-4.22,1.53-9.95-0.83-15.74-6.49c-6.43-6.28-12.15-15.74-16.11-26.62s-5.66-21.8-4.77-30.74
		c0.79-8.05,3.67-13.55,7.88-15.09c7.4-2.69,18.7,6.52,26.87,21.89c0.78,1.46,2.6,2.02,4.06,1.24c1.46-0.78,2.02-2.59,1.24-4.06
		c-9.9-18.63-23.65-28.56-34.22-24.72c-4.72,1.72-8.21,5.91-10.19,12.06L19.77,66.01c-3.8,4.21-4.9,9.91-2.96,15.23
		c1.94,5.33,6.45,8.98,12.06,9.77L32,91.45V119c0,4.41,3.59,8,8,8h20c4.41,0,8-3.59,8-8v-14.61c0-1.66-1.34-3-3-3s-3,1.34-3,3V119
		c0,1.1-0.9,2-2,2H40c-1.1,0-2-0.9-2-2V92.29l47.53,6.66c3.7,2.33,7.35,3.53,10.78,3.53c1.65,0,3.25-0.28,4.79-0.83
		c6.66-2.42,10.87-9.85,11.84-20.6l8.45,2.93c0.33,0.11,0.66,0.17,0.98,0.17c1.24,0,2.41-0.78,2.83-2.02
		C125.75,80.55,124.92,78.84,123.35,78.3z M38,86.23l-6-0.84V76c0-1.66,1.34-3,3-3s3,1.34,3,3V86.23z"></path></svg>
          &nbsp;&nbsp;<strong>{data?.title}</strong> &nbsp;| &nbsp;{data?.sub_title} &nbsp;| &nbsp;
          <strong style={{whiteSpace:"nowrap"}}>
            &nbsp;<span id="mytimer-hours-offer"></span>&nbsp;
            <span id="mytimer-min-offer"></span> &nbsp;<span id="mytimer-sec-offer"></span>
          </strong>
          &nbsp;
          <span
            className={style.grab_btn}
            onClick={(e) => {
              e.preventDefault();
              comboSlugAction(data?.slug)
              if (userData) {
                //route to checkout
                if(activePlans.length == 0){
                  router.push(`/combo/${data.slug}`);
                }else{
                  alertBoxAction({
                    type: "SUCCESS",
                    title: "",
                    msg: "You already have access to the course",
                  });
                }
              } else {
                let slug = data?.slug;
                redirectionAction("REDIRECT", `/combo/${slug}`);
                document.querySelector("body").classList.add("open-modal-login");
              }
            }}
          >
            <strong style={{whiteSpace:"nowrap"}}>GRAB NOW !</strong>
          </span>
        </div>
      )}
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    subscription: state.userProfileData.userSubscriptionData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    redirectionAction: (data, url) => dispatch(updateRedirection(data, url)),
    alertBoxAction: (data) => dispatch(alertBox(data)),
    comboSlugAction:(data)=> dispatch(addComboSlugAction(data))
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(OfferHeader);
