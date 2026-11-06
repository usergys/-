import { useState } from "react";
import { User, MapPin, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";

type FormState = {
  nickname: string;
  phone: string;
  email: string;
  receiver: string;
  phone2: string;
  province: string;
  city: string;
  district: string;
  address: string;
};

const INITIAL: FormState = {
  nickname: "",
  phone: "",
  email: "",
  receiver: "",
  phone2: "",
  province: "",
  city: "",
  district: "",
  address: "",
};

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-gray-400 outline-none transition-colors duration-200 focus:border-brocade-gold focus:ring-2 focus:ring-brocade-gold/30";

const labelCls = "mb-1.5 block text-sm font-medium text-indigo-deep-900";

export default function Register() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(
          data.errors ? data.errors.join("；") : data.message || "提交失败，请稍后重试"
        );
        return;
      }
      localStorage.setItem("xiuwei-user", JSON.stringify(form));
      setSubmitted(true);
    } catch {
      setErrorMsg("无法连接服务器，请确认后端已启动");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        kicker="注册会员"
        title="注册个人信息与收货地址"
        desc="注册后即可保存您的 AI 生成作品、定制订单，并使用收货地址快速下单。"
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {submitted ? (
            <div className="flex flex-col items-center rounded-xl border border-brocade-gold/40 bg-brocade-gold/5 p-12 text-center">
              <CheckCircle2 size={56} className="text-brocade-gold" />
              <h2 className="mt-5 font-serif text-2xl font-bold text-indigo-deep-900">
                注册成功！
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-600">
                欢迎加入绣未，{form.nickname || "朋友"}
                ！您已解锁纹样生成与一键定制功能，收货地址已保存。
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm(INITIAL);
                }}
                className="mt-8 cursor-pointer rounded-lg border border-indigo-deep-800 px-6 py-2.5 text-sm font-medium text-indigo-deep-800 transition-colors duration-200 hover:bg-indigo-deep-800 hover:text-white"
              >
                填写新的信息
              </button>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="rounded-xl border border-gray-200 bg-brocade-ivory p-6 sm:p-10"
            >
              {/* 个人信息 */}
              <fieldset>
                <legend className="flex items-center gap-2 font-serif text-lg font-bold text-indigo-deep-900">
                  <User size={20} className="text-brocade-gold" />
                  个人信息
                </legend>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="nickname" className={labelCls}>
                      昵称 <span className="text-brocade-rose">*</span>
                    </label>
                    <input
                      id="nickname"
                      required
                      value={form.nickname}
                      onChange={set("nickname")}
                      placeholder="您的昵称"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelCls}>
                      手机号 <span className="text-brocade-rose">*</span>
                    </label>
                    <input
                      id="phone"
                      required
                      type="tel"
                      pattern="1[3-9][0-9]{9}"
                      title="请输入 11 位手机号"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="11 位手机号"
                      className={inputCls}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className={labelCls}>
                      邮箱（选填）
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="用于接收作品与订单通知"
                      className={inputCls}
                    />
                  </div>
                </div>
              </fieldset>

              {/* 收货地址 */}
              <fieldset className="mt-10 border-t border-gray-200 pt-10">
                <legend className="flex items-center gap-2 font-serif text-lg font-bold text-indigo-deep-900">
                  <MapPin size={20} className="text-brocade-gold" />
                  收货地址
                </legend>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="receiver" className={labelCls}>
                      收货人 <span className="text-brocade-rose">*</span>
                    </label>
                    <input
                      id="receiver"
                      required
                      value={form.receiver}
                      onChange={set("receiver")}
                      placeholder="收货人姓名"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone2" className={labelCls}>
                      联系电话 <span className="text-brocade-rose">*</span>
                    </label>
                    <input
                      id="phone2"
                      required
                      type="tel"
                      pattern="1[3-9][0-9]{9}"
                      title="请输入 11 位手机号"
                      value={form.phone2}
                      onChange={set("phone2")}
                      placeholder="11 位手机号"
                      className={inputCls}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:col-span-2">
                    <div>
                      <label htmlFor="province" className={labelCls}>
                        省份 <span className="text-brocade-rose">*</span>
                      </label>
                      <input
                        id="province"
                        required
                        value={form.province}
                        onChange={set("province")}
                        placeholder="广西壮族自治区"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className={labelCls}>
                        城市 <span className="text-brocade-rose">*</span>
                      </label>
                      <input
                        id="city"
                        required
                        value={form.city}
                        onChange={set("city")}
                        placeholder="南宁市"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="district" className={labelCls}>
                        区县 <span className="text-brocade-rose">*</span>
                      </label>
                      <input
                        id="district"
                        required
                        value={form.district}
                        onChange={set("district")}
                        placeholder="青秀区"
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className={labelCls}>
                      详细地址 <span className="text-brocade-rose">*</span>
                    </label>
                    <input
                      id="address"
                      required
                      value={form.address}
                      onChange={set("address")}
                      placeholder="街道、门牌号、小区等"
                      className={inputCls}
                    />
                  </div>
                </div>
              </fieldset>

              {errorMsg && (
                <p className="mt-6 rounded-lg border border-brocade-rose/30 bg-brocade-rose/5 px-4 py-3 text-center text-sm text-brocade-rose">
                  {errorMsg}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="mt-10 w-full cursor-pointer rounded-lg bg-indigo-deep-900 py-3.5 text-base font-medium text-white transition-colors duration-200 hover:bg-indigo-deep-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "提交中…" : "完成注册"}
              </button>
              <p className="mt-4 text-center text-xs text-gray-400">
                提交即表示同意《用户协议》与《隐私政策》
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
