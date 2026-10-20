FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
RUN dotnet new web -n Checkout -o . >/dev/null
COPY install.sh ./
RUN sh install.sh >/dev/null
COPY Program.cs ./
RUN dotnet publish -c Release -o /out >/dev/null

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /out ./
CMD ["dotnet", "Checkout.dll"]
