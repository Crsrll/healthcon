export default function Avatar({ user, size = 40 }) {
  // Handle both patient (firstName/lastName) and clinic (clinicName)
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.clinicName) {
      return user.clinicName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "?";
  };

  const initials = getInitials();

  if (user?.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt={initials}
        width={size}
        height={size}
        style={{ borderRadius: "50%", objectFit: "cover", width: size, height: size }}
      />
    );
  }

  return (
    <div
      // style={{
      //   width: size,
      //   height: size,
      //   borderRadius: "50%",
      //   backgroundColor: "#1a355d",
      //   color: "#b2f5ea",
      //   display: "flex",
      //   alignItems: "center",
      //   justifyContent: "center",
      //   fontWeight: "900",
      //   fontSize: size * 0.35,
      //   userSelect: "none",
      // }}
    >
      {initials}
    </div>
  );
}