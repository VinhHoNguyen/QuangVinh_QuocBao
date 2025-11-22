"use client"

import { useState, useEffect } from "react"
import {
  fetchRestaurants,
  fetchRestaurantById,
  fetchProducts,
  fetchProductsByRestaurant,
  fetchProductById,
  Restaurant,
  Dish,
} from "./restaurant-data"

// Hook to fetch all restaurants
export function useRestaurants(status = "active") {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchRestaurants(status)
        setRestaurants(data)
      } catch (err) {
        console.error('Error loading restaurants:', err)
        setError(err as Error)
        setRestaurants([])
      } finally {
        setLoading(false)
      }
    }

    loadRestaurants()
  }, [status])

  return { restaurants, loading, error, refetch: () => setLoading(true) }
}

// Hook to fetch single restaurant
export function useRestaurant(id: string) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchRestaurantById(id)
        setRestaurant(data)
      } catch (err) {
        console.error('Error loading restaurant:', err)
        setError(err as Error)
        setRestaurant(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadRestaurant()
    }
  }, [id])

  return { restaurant, loading, error }
}

// Hook to fetch all products
export function useProducts(params?: { category?: string; available?: boolean; restaurantId?: string }) {
  const [products, setProducts] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProducts(params)
        setProducts(data)
      } catch (err) {
        console.error('Error loading products:', err)
        setError(err as Error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [params?.category, params?.available, params?.restaurantId])

  return { products, loading, error }
}

// Hook to fetch products by restaurant
export function useRestaurantProducts(restaurantId: string) {
  const [products, setProducts] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProductsByRestaurant(restaurantId)
        setProducts(data)
      } catch (err) {
        console.error('Error loading products by restaurant:', err)
        setError(err as Error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (restaurantId) {
      loadProducts()
    }
  }, [restaurantId])

  return { products, loading, error }
}

// Hook to fetch single product
export function useProduct(id: string) {
  const [product, setProduct] = useState<Dish | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const data = await fetchProductById(id)
        setProduct(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadProduct()
    }
  }, [id])

  return { product, loading, error }
}
