#include <fstream>
#include <iostream>
#include <string>

int main() {
    std::ifstream file("README.md");

    if (!file) {
        std::cerr << "Cannot open README.md\n";
        return 1;
    }

    std::string line;

    while (std::getline(file, line)) {
        std::cout << line << '\n';
    }

    return 0;
}