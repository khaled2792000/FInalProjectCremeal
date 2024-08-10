import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Keyboard,
} from "react-native";
import {  useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../components/BackButton";
import FormTitle from "../components/FormTitle";
import InputFiled from "../components/InputFiled";
import { useForm } from "react-hook-form";
import FormButton from "../components/FormButton";
import {
  forget_Reset_password,
  forget_Verify_code,
  forget_send_code,
} from "../../assets/utils/api/forget_api";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";

const { width, height } = Dimensions.get("window");
const ForgetPassword = ({ navigation }) => {
  const [forgetScreenIndex, setForgetScreenIndex] = useState(0);
  const [userId, setUserId] = useState(-1);
  const [userEmail, setUserEmail] = useState(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const schedulingOptions = {
    content: {
      title: `Send reset Password`,
      body: "check your email for the code to verify  your email",
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      color: "blue",
    },
    trigger: {
      seconds: 5,
    },
  };

  const sendCode = (data) => {
    Keyboard.dismiss();
    forget_send_code(data.email)
      .then((result) => {
        if (result.status == 200) {
          if (result.data == 0) return;
          Notifications.scheduleNotificationAsync(schedulingOptions);
          setUserId(result.data);
          setForgetScreenIndex(1);
          reset();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const sendCodeAgain = () => {
    let data = {
      email: userEmail,
    };
    sendCode(data);
  };

  const resetPassword = (data) => {
    Keyboard.dismiss();
    if (data.password == data.confirmPassword) {
      forget_Reset_password(userId, data.password)
        .then((result) => {
          if (result.status == 200) {
            reset();
            setForgetScreenIndex(2);
            navigation.navigate("HomeScreen");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const verifyCode = (data) => {
    Keyboard.dismiss();
    forget_Verify_code(userId, data.code)
      .then((result) => {
        if (result.status == 200) {
          reset();
          setForgetScreenIndex((prev) => prev + 1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      {forgetScreenIndex == 0 ? (
        <View>
          <BackButton callFunction={() => navigation.navigate("LoginScreen")} />
          <FormTitle
            title={"Forget Password"}
            description={"Enter you email to get code to reset your password"}
            style={{ marginVertical: (height * 10) / 100 }}
          />
          <InputFiled
            control={control}
            Label={"Email Here"}
            placeHolder={"user@email.com"}
            IsItPassword={false}
            inputName={"email"}
            errors={errors}
          />
          <FormButton
            callFunction={handleSubmit(sendCode)}
            text={"Continue"}
            style={{ marginTop: 5 }}
          />
        </View>
      ) : forgetScreenIndex == 1 ? (
        <View>
          <BackButton
            callFunction={() => {
              setForgetScreenIndex((prev) => prev - 1);
              reset();
            }}
          />
          <FormTitle
            title={"Enter The code that U received "}
            description={"Enter you email to get code to reset your password"}
            style={{ marginVertical: (height * 10) / 100 }}
          />
          <InputFiled
            control={control}
            Label={"Code here"}
            placeHolder={"code"}
            IsItPassword={false}
            inputName={"code"}
            errors={errors}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 5,
            }}
          >
            <Text>Didn't get an code?</Text>
            <TouchableOpacity onPress={sendCodeAgain}>
              <Text style={{ color: "blue" }}>Resend</Text>
            </TouchableOpacity>
          </View>
          <FormButton
            callFunction={handleSubmit(verifyCode)}
            text={"Continue"}
            style={{ marginTop: 5 }}
          />
        </View>
      ) : (
        <View>
          <BackButton
            callFunction={() => {
              setForgetScreenIndex((prev) => prev - 1);
              reset();
            }}
          />
          <FormTitle
            title={"Enter new Password"}
            description={"Enter new password for your account"}
            style={{ marginVertical: (height * 10) / 100 }}
          />
          <InputFiled
            control={control}
            Label={"Password"}
            placeHolder={"*******"}
            IsItPassword={true}
            inputName={"password"}
            errors={errors}
          />
          <InputFiled
            control={control}
            Label={"Confirm password"}
            placeHolder={"*******"}
            IsItPassword={true}
            inputName={"confirmPassword"}
            errors={errors}
          />

          <FormButton
            callFunction={handleSubmit(resetPassword)}
            text={"Reset Password"}
            style={{ marginTop: 5 }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
