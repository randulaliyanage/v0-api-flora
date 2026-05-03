"use client"

interface FloralCardProps {
  flower: {
    id: string
    name: string
    image_url: string
    price_lkr: number
    stock_count: number
  }
  onAdd: (flower: FloralCardProps["flower"]) => void
}

export function FloralCard({ flower, onAdd }: FloralCardProps) {
  return (
    <div style={{ marginTop: "60px", position: "relative" }}>
      {/* Image — lives OUTSIDE and ABOVE the white card */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "120px",
          height: "120px",
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        <img
          src={flower.image_url || "/placeholder.svg"}
          alt={flower.name}
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
        />
      </div>

      {/* White card — image is NOT inside this */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "1.5rem",
          border: "1px solid rgba(153,0,72,0.12)",
          padding: "70px 24px 24px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "visible",
        }}
      >
        {flower.stock_count < 20 && (
          <span
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "#fef3c7",
              color: "#92400e",
              fontSize: "10px",
              padding: "3px 10px",
              borderRadius: "9999px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Low Stock
          </span>
        )}

        <p
          style={{
            fontFamily: "'Noto Serif', serif",
            fontStyle: "italic",
            fontSize: "1rem",
            color: "#1a0a0e",
            margin: "0 0 6px 0",
          }}
        >
          {flower.name}
        </p>
        <p
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#70585b",
            margin: "0 0 6px 0",
          }}
        >
          per stem
        </p>
        <p
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#990048",
            margin: "0 0 16px 0",
          }}
        >
          LKR {flower.price_lkr.toLocaleString("en-LK")}
        </p>

        <button
          onClick={() => onAdd(flower)}
          aria-label={`Add ${flower.name} to bouquet`}
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            width: "36px",
            height: "36px",
            borderRadius: "9999px",
            background: "#990048",
            color: "white",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          +
        </button>
      </div>
    </div>
  )
}
