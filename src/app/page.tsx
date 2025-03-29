import ChatComponent from "@/components/chat";

export default function Home() {
  return (
    <>
      <ChatComponent />

      {/* Footer */}
      <footer className="border-t border-t-gray-200 container text-center py-2">
        <p className="text-sm text-gray-600">
          Made with ❤️ by <span className="font-semibold">Manish</span>
        </p>
      </footer >
    </>
  );
}
