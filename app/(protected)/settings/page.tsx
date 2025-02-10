import ChangeAvata from "@/components/settting/ChangeAvata";
import ProfileForm from "@/components/settting/ProfileForm";
import SecurityForm from "../../../components/settting/SercurityForm";

export default function SettingsPage() {
  return (
    <>
      <h1 className="text-5xl text-center text-gray-800 dark:text-gray-100 mb-8">
        Settings
      </h1>
      <div className="flex gap-8 flex-col">
        <section className="border-2 border-brand-primary p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            프로필 수정
          </h2>
          <ChangeAvata />
          <ProfileForm />
        </section>
        <section className="border-2 border-brand-primary p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            보안 설정
          </h2>
          <SecurityForm />
        </section>
      </div>
    </>
  );
}
