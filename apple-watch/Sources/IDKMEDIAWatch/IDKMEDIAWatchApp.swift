import SwiftUI

@main
struct IDKMEDIAWatchApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

struct ContentView: View {
    var body: some View {
        VStack {
            Text("IDKMEDIA")
                .font(.title)
                .foregroundColor(.cyan)
            Text("WatchOS")
                .font(.caption)
                .foregroundColor(.gray)
        }
    }
}
