export function toUpper(value: string): string {
    if (!value) return "";
  
    return value.toUpperCase();
  }
  

  export function capitalize(value: string): string {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  


  export function capitalizeFirstWords(value: string): string {
    if (!value) return "";
  
    return value
      .toLowerCase()
      .split(" ")
      .map((word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  }

  export function formatPrice(
    value: number,
    locale: string = "en-US",
    currency?: string
  ): string {
    if (isNaN(value)) return "0";
  
    if (currency) {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }).format(value);
    }
  
    return new Intl.NumberFormat(locale).format(value);
  }
  
  