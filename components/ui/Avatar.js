export default function Avatar({ user, size = 40 }) {
  const displayName = `${user?.firstName[0]}${user?.lastName[0]}`; 
  const initials = user?.firstName || user?.lastName 
    ? displayName
        // .split(" ")
        // .map((n) => n[0])
        // .join("")
        // .toUpperCase()
        // .slice(0, 2) // max 2 letters
    : user?.firstName[0];

  if (user?.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt={user.displayName}
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
      //   backgroundColor: "#1a355d", // HealthCon navy
      //   color: "#b2f5ea",           // HealthCon mint
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