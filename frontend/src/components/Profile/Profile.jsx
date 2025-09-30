import "./Profile.css";
import SideBar from "../SideBar/SideBar";
import ClothesSection from "../ClothesSection/ClothesSection";

const Profile = ({
  cards,
  onCardClick,
  onCardDelete,
  onAddNewClick,
  onLikeClick,
  onLogOut,
  onProfileChange,
}) => (
  <div className="profile">
    <section className="profile-sidebar">
      <SideBar onLogOut={onLogOut} onProfileChange={onProfileChange} />
    </section>
    <section className="profile-clothes">
      <ClothesSection
        sectionData={cards}
        onAddNewClick={onAddNewClick}
        onCardClick={onCardClick}
        onCardDelete={onCardDelete}
        onLikeClick={onLikeClick}
      />
    </section>
  </div>
);

export default Profile;
